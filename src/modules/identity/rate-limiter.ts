import 'server-only';

/**
 * Rate limiting — the same "real contract, honest adapter, documented
 * production gap" pattern P04 used for storage and P05 used for search:
 * this environment has no Redis/Upstash available, so there is a real,
 * fully-tested in-memory adapter for dev/test, and a clearly documented
 * requirement for what production needs instead. Nothing here pretends a
 * distributed limiter exists when it doesn't.
 *
 * Fixed-window counting, keyed by caller (IP + normalized email for login,
 * so a single IP guessing across many accounts and a botnet guessing one
 * account are both caught).
 */

export interface RateLimitResult {
  allowed: boolean;
  /** Milliseconds until the caller may retry, only meaningful when `!allowed`. */
  retryAfterMs: number;
  remaining: number;
}

export interface RateLimiter {
  check(key: string): Promise<RateLimitResult>;
}

export interface RateLimiterOptions {
  /** Max allowed attempts within `windowMs`. */
  limit: number;
  windowMs: number;
}

/**
 * In-memory, single-process fixed-window limiter. Correct and fully
 * functional for dev/test and for a single-instance deployment — the
 * documented gap is horizontal scaling: two app instances each keep their
 * own counters, so a caller effectively gets `limit` attempts *per
 * instance* rather than one shared budget. A real production deployment
 * (more than one instance behind a load balancer) needs a shared store
 * (Redis/Upstash, keyed the same way) implementing this same `RateLimiter`
 * interface — swapping it in is a one-file change in `provider-factory.ts`,
 * exactly like `media`'s storage provider and `search`'s search provider.
 */
export class InMemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, { count: number; windowStart: number }>();

  constructor(private readonly options: RateLimiterOptions) {}

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.hits.get(key);

    if (!entry || now - entry.windowStart >= this.options.windowMs) {
      this.hits.set(key, { count: 1, windowStart: now });
      return { allowed: true, retryAfterMs: 0, remaining: this.options.limit - 1 };
    }

    if (entry.count >= this.options.limit) {
      return {
        allowed: false,
        retryAfterMs: entry.windowStart + this.options.windowMs - now,
        remaining: 0,
      };
    }

    entry.count += 1;
    return { allowed: true, retryAfterMs: 0, remaining: this.options.limit - entry.count };
  }

  /** Test-only: forget every tracked key. */
  reset(): void {
    this.hits.clear();
  }
}

/** 10 attempts per 5 minutes per (IP, email) pair — generous enough that a
 * real user mistyping a password a few times is never locked out, tight
 * enough to make an online brute-force guess of a 12-character password
 * space infeasible. */
export const LOGIN_RATE_LIMIT: RateLimiterOptions = { limit: 10, windowMs: 5 * 60 * 1000 };

let loginLimiter: InMemoryRateLimiter | undefined;

/** The one limiter instance the login action shares across requests within
 * this process — a fresh limiter per call would never accumulate hits. */
export function getLoginRateLimiter(): InMemoryRateLimiter {
  if (!loginLimiter) loginLimiter = new InMemoryRateLimiter(LOGIN_RATE_LIMIT);
  return loginLimiter;
}

/** Test-only. */
export function resetLoginRateLimiter(): void {
  loginLimiter?.reset();
}

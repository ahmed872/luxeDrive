import { describe, expect, it } from 'vitest';

import { InMemoryRateLimiter } from './rate-limiter';

describe('InMemoryRateLimiter', () => {
  it('allows attempts up to the limit within the window', async () => {
    const limiter = new InMemoryRateLimiter({ limit: 3, windowMs: 60_000 });
    expect((await limiter.check('k')).allowed).toBe(true);
    expect((await limiter.check('k')).allowed).toBe(true);
    expect((await limiter.check('k')).allowed).toBe(true);
  });

  it('blocks the attempt after the limit is reached, with a positive retryAfterMs', async () => {
    const limiter = new InMemoryRateLimiter({ limit: 2, windowMs: 60_000 });
    await limiter.check('k');
    await limiter.check('k');
    const blocked = await limiter.check('k');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(blocked.remaining).toBe(0);
  });

  it('tracks each key independently', async () => {
    const limiter = new InMemoryRateLimiter({ limit: 1, windowMs: 60_000 });
    await limiter.check('a');
    const blockedA = await limiter.check('a');
    const firstB = await limiter.check('b');
    expect(blockedA.allowed).toBe(false);
    expect(firstB.allowed).toBe(true);
  });

  it('resets the window once it elapses', async () => {
    const limiter = new InMemoryRateLimiter({ limit: 1, windowMs: 10 });
    await limiter.check('k');
    expect((await limiter.check('k')).allowed).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect((await limiter.check('k')).allowed).toBe(true);
  });

  it('reset() clears every tracked key', async () => {
    const limiter = new InMemoryRateLimiter({ limit: 1, windowMs: 60_000 });
    await limiter.check('k');
    expect((await limiter.check('k')).allowed).toBe(false);
    limiter.reset();
    expect((await limiter.check('k')).allowed).toBe(true);
  });
});

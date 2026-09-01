import type { NextConfig } from 'next';

/**
 * `next/image` refuses to optimize an external host it hasn't been told
 * about — every *external* (cross-origin) domain a real `<Image>` `src` can
 * point to has to be listed here. Same-origin media (the local storage
 * provider's `${NEXT_PUBLIC_SITE_URL}/api/media/local-upload/...` URLs)
 * needs nothing added — remotePatterns only governs other origins. Read
 * directly from `process.env` (not the validated `serverEnv()`/
 * `clientEnv()` parsers) because this file runs before the app's module
 * graph exists; it stays this minimal on purpose.
 *
 * `images.unsplash.com` is P03/P04's known, documented case: the 15
 * migrated-catalog MediaAssets that P04's migration script couldn't
 * download in this sandbox (network egress blocked) are still `EXTERNAL`
 * rows whose `storageKey` is the original Unsplash URL — see
 * `media/cdn.ts`. `MEDIA_PUBLIC_BASE_URL` is the real production case: a
 * CDN domain in front of S3, genuinely a different origin from the app
 * itself. Nothing else should add a host here by convention.
 */
function remotePatterns(): NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> {
  const patterns: NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> = [
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ];
  if (process.env.MEDIA_PUBLIC_BASE_URL) {
    try {
      const url = new URL(process.env.MEDIA_PUBLIC_BASE_URL);
      patterns.push({
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
      });
    } catch {
      // Not a valid absolute URL — nothing to add.
    }
  }
  return patterns;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: remotePatterns() },
  // The Playwright suite (P02) drives the dev server via 127.0.0.1 rather
  // than localhost; without this, Next's dev-origin check silently drops the
  // HMR/RSC websocket for that host, and components stop responding to
  // interaction (a click that never opens its dialog, with no console error).
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  // Fail the production build on type errors instead of shipping them.
  // Next 16 no longer runs ESLint during `next build`; linting is its own CI
  // step (`pnpm lint`) so it gates the same way without slowing the build.
  typescript: { ignoreBuildErrors: false },
  // The legacy Vite app lives in /legacy and is never part of this build.
  outputFileTracingExcludes: {
    '*': ['./legacy/**/*'],
  },
};

export default nextConfig;

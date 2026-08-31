import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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

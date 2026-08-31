import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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

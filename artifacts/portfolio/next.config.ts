import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  // Keep canonical and other metadata in the initial <head> for all user agents.
  htmlLimitedBots: /.*/,
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    ...(process.env.REPLIT_DEV_DOMAIN ? [process.env.REPLIT_DEV_DOMAIN] : []),
  ],
  async redirects() {
    return [
      {
        source: "/Home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

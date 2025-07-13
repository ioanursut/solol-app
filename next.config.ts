import type { NextConfig } from "next";
import { env } from "process";
import withPWA from "next-pwa";

const withPwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: env.REPLIT_DOMAINS
    ? [env.REPLIT_DOMAINS.split(",")[0]]
    : [],
};

export default withPwaConfig(nextConfig);

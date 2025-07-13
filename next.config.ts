import type { NextConfig } from "next";
import { env } from "process";
import withPWA from "next-pwa";

// 👇 lägg till PWA-konfiguration
const withPwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: env.NODE_ENV === "development", // PWA off i dev
});

const nextConfig: NextConfig = {
  // Din tidigare config
  allowedDevOrigins: [env.REPLIT_DOMAINS.split(",")[0]],
};

// 👇 exportera med PWA wrapper
export default withPwaConfig(nextConfig);
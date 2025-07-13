import type { NextConfig } from "next";
import withPWA from "next-pwa";

const withPwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Tom just nu – du kan lägga in andra inställningar senare
};

export default withPwaConfig(nextConfig);
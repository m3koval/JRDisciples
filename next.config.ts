import type { NextConfig } from "next";

const isAppBuild = process.env.CAPACITOR_BUILD === "1";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.0.5.74"],
  // The App Store build is a bundled, offline static app. Keep the normal
  // Vercel build unchanged unless CAPACITOR_BUILD is explicitly enabled.
  output: isAppBuild ? "export" : undefined,
  trailingSlash: isAppBuild,
  images: {
    unoptimized: isAppBuild,
  },
};

export default nextConfig;

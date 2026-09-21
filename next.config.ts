import type { NextConfig } from "next";

// The Capacitor app bundles a fully static build of this same site — set
// BUILD_TARGET=capacitor to produce it. The normal web deployment is
// untouched: without that env var, `next build` behaves exactly as before.
const isCapacitorBuild = process.env.BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.0.5.74"],
  ...(isCapacitorBuild
    ? {
        output: "export",
        // No server left at runtime to optimize images on demand.
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;

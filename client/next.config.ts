import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["192.168.100.17"],
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // Local backend (development)
      { protocol: "http", hostname: "localhost" },
      // AWS S3 (pre-signed URLs used as fallback thumbnails)
      { protocol: "https", hostname: "**.amazonaws.com" },
      // Add your production backend hostname here, e.g.:
      // { protocol: "https", hostname: "api.yourdomain.com" },
    ],
  },
};

export default nextConfig;

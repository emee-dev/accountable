import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [],
    formats: [],
  },
  async redirects() {
    return [
      {
        source: "/tweets",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

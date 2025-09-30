import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

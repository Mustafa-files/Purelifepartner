import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iucizzrqvpsuotatmvrc.supabase.co",
      },
    ],
  },
};

export default nextConfig;

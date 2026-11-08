import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/questions-to-ask-before-nikah",
        destination: "/blog/questions-to-ask-before-marriage",
        permanent: true,
      },
    ];
  },
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

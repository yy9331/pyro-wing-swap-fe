import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oikbmogyevlxggbzfpnp.supabase.co',
      },
    ],
  },
};

export default nextConfig;

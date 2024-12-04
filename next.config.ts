import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: "ucarecdn.com",
        port: "",
        pathname: "/*/**",
      },
    ],
  },
};

export default nextConfig;

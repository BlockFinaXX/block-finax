import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
        },
      },
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5555/api/:path*",
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555",
  },
  experimental: {
    turbo: false,
  },
};

export default nextConfig;

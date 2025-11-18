// import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build quality gates enabled - ensures type safety and code quality
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig;

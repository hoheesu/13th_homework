// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactRefresh: false,
  },

  swcMinify: true,
};

module.exports = nextConfig;

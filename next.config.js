/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.dummyjson.com', 'dummyjson.com'],
  },
};

module.exports = nextConfig;

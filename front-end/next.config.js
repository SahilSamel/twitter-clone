/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pbs.twimg.com','firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig

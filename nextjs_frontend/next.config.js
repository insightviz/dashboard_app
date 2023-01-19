/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://api.insightviz.com/:path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig

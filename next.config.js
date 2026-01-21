/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Increase API route body size limit to 10MB for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig

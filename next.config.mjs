/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['https://ff149cac-aba8-4669-942d-ae755d24f669-00-1uzogga77msh3.spock.replit.dev', 'https://*.replit.dev', 'http://127.0.0.1', 'http://0.0.0.0:5000', 'http://ff149cac-aba8-4669-942d-ae755d24f669-00-1uzogga77msh3.spock.replit.dev'],
}

export default nextConfig
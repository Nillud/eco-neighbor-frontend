import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.yandex.net'
      },
      {
        protocol: 'https',
        hostname: 'github.com'
      },
    ]
  }
}

export default nextConfig

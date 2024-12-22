/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'http://localhost:8899',
    NEXT_PUBLIC_PRIMARY_NODE_URL: process.env.NEXT_PUBLIC_PRIMARY_NODE_URL || 'http://localhost:8001',
    NEXT_PUBLIC_SECONDARY_NODE_URL: process.env.NEXT_PUBLIC_SECONDARY_NODE_URL || 'http://localhost:8002'
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development' 
      ? [
          {
            source: '/api/:path*',
            destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/:path*`
          }
        ]
      : [];
  }
}

module.exports = nextConfig

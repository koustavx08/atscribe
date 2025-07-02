/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for development to avoid Windows symlink issues
  // output: 'standalone', // Uncomment for production Docker builds
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    // Fix for Windows development
    esmExternals: 'loose',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Webpack configuration for better Windows compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('mongoose');
    }
    return config;
  },
}

export default nextConfig

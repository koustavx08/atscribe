/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for development to avoid Windows symlink issues
  // output: 'standalone', // Uncomment for production Docker builds
  serverExternalPackages: ['mongoose', 'pdf-parse', 'puppeteer'],
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
      config.externals.push('mongoose', 'pdf-parse', 'puppeteer');
    }
    // Exclude problematic packages from client-side bundling
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        buffer: false,
        stream: false,
        util: false,
        url: false,
        querystring: false,
        http: false,
        https: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    // Ignore pdf-parse test files
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    config.module = {
      ...config.module,
      rules: [
        ...(config.module?.rules || []),
        {
          test: /\.pdf$/,
          type: 'asset/resource',
        },
      ],
    };
    return config;
  },
}

export default nextConfig

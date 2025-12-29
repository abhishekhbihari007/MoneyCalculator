/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Enable SWC minification
  swcMinify: true,
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'three'],
    // Enable partial prerendering for better performance
    ppr: false,
  },
  // Performance optimizations
  productionBrowserSourceMaps: false,
  // Webpack optimizations for Three.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize Three.js bundle size
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': require.resolve('three'),
      };
    }
    return config;
  },
  // Optimize build output
  poweredByHeader: false,
  compress: true,
  // Faster compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;


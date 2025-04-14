/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
    unoptimized: process.env.NODE_ENV === "production",
  },
  // Remove basePath as it's not needed for Netlify
  // basePath: process.env.NODE_ENV === "production" ? "/enki" : "",

  // Optimize chunking for better performance
  webpack: (config, { isServer }) => {
    // Optimize client-side chunking
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|framer-motion)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module) {
              return (
                module.size() > 80000 &&
                /node_modules[/\\]/.test(module.identifier())
              );
            },
            name(module) {
              const moduleId = module.identifier();
              let hash = 0;
              for (let i = 0; i < moduleId.length; i++) {
                hash = (hash << 5) - hash + moduleId.charCodeAt(i);
                hash = hash & hash; // Convert to 32bit integer
              }
              return `lib-${Math.abs(hash).toString(16).substring(0, 8)}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name(module, chunks) {
              return `shared-${chunks.map((c) => c.name).join("~")}`;
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;

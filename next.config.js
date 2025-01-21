// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['doraemon.fandom.com', 'static.wikia.nocookie.net', 'upload.wikimedia.org', 'example.com', 'your-storage-domain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
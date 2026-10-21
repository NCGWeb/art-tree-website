/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first: better quality-per-byte than WebP for photographic
    // content, and Next serves whichever format the requesting browser
    // supports, falling back to WebP then the original.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

module.exports = nextConfig;

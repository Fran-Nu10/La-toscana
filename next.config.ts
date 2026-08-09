import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Photographs are stand-ins from the Unsplash CDN today. When the real
    // La Toscana photography lands in /public, point content/photos.ts at the
    // local paths — next/image handles both and this list can go.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    // Narrow set of widths: phones first, then the sizes the layout actually
    // asks for. Fewer entries means fewer variants to generate and cache.
    deviceSizes: [360, 430, 640, 828, 1080, 1440, 1920],
    imageSizes: [180, 256, 360, 480],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig

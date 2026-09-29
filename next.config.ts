import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // La fotografía real vive en /public/media. Unsplash queda sólo para los
    // platos que todavía no tienen foto propia; cuando no quede ninguno, esta
    // lista se puede borrar.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    // Narrow set of widths: phones first, then the sizes the layout actually
    // asks for. Fewer entries means fewer variants to generate and cache.
    deviceSizes: [360, 430, 640, 828, 1080, 1440, 1920],
    imageSizes: [180, 256, 360, 480],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig

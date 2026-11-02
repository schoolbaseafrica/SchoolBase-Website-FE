import type { NextConfig } from "next"
import withPWAInit from "next-pwa"
// next-pwa does not publish TypeScript declarations for its default cache rules.
// @ts-expect-error no declaration for next-pwa/cache
import defaultCache from "next-pwa/cache"

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: ({ url }: { url: URL }) =>
        url.origin === self.origin &&
        (url.pathname === "/admin" || url.pathname.startsWith("/admin/")),
      handler: "NetworkOnly",
    },
    ...defaultCache,
  ],
})

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
    ],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {},
}

export default withPWA(nextConfig)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" }, // ✅ always-working fallback
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

module.exports = nextConfig;

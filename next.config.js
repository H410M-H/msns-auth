/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dvvbxrs55/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "asset.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 86400,
  },
};

export const cloudinaryConfig = {
  cloudName: "dvvbxrs55",
  uploadPreset: {
    profilePic: "msnsPDP",
    cv: "msnsCV",
  },
};

export default nextConfig;

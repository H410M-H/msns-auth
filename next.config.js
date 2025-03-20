/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
export const cloudinaryConfig = {
    cloudName: "dvvbxrs55",
    uploadPreset: {
      profilePic: "msnsPDP",
      cv: "msnsCV",
    },
  };
  
  // Create the main configuration object
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
          hostname: "storage.googleapis.com",
          pathname: "/**",
        },
      ],
    },
};
export default nextConfig;

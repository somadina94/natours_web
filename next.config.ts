import type { NextConfig } from "next";

const remotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  { protocol: "https", hostname: "*.backblazeb2.com", pathname: "/**" },
  { protocol: "http", hostname: "*.backblazeb2.com", pathname: "/**" },
];

const media = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
if (media) {
  try {
    const u = new URL(media);
    remotePatterns.push({
      protocol: u.protocol === "https:" ? "https" : "http",
      hostname: u.hostname,
      pathname: "/**",
    });
  } catch {
    // ignore invalid env URL
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns,
  },
};

export default nextConfig;

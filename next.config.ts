import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "grace-services.s3.us-east-1.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "diarioelnortino.cl", pathname: "/**" },
      { protocol: "https", hostname: "imagenes.elpais.com", pathname: "/**" },
      { protocol: "https", hostname: "internationalsocialist.net", pathname: "/**" },
      { protocol: "https", hostname: "cambio21.cl", pathname: "/**" },

    ],
  },

};

export default nextConfig;

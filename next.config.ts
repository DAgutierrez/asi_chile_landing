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
      { protocol: "https", hostname: "www.shutterstock.com", pathname: "/**" },
      { protocol: "https", hostname: "imagenes.eleconomista.com.mx", pathname: "/**" },
      { protocol: "https", hostname: "content.nationalgeographic.com.es", pathname: "/**" },
      { protocol: "https", hostname: "lamarejada.cl", pathname: "/**" },
      { protocol: "https", hostname: "vlbdporkjtogegumkgnk.supabase.co", pathname: "/storage/v1/object/**" },

    ],
  },

};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
        'mattiaf245.sg-host.com', // **Aggiungi o verifica questo dominio**
        // Aggiungi qui altri domini se carichi immagini da altre fonti
    ],
  },
};

export default nextConfig;

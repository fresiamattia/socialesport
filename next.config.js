/** @type {import('next').NextConfig} */ // Keep this line for type hints
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'mattiaf245.sg-host.com', // **Aggiungi o verifica questo dominio**
      // Aggiungi qui altri domini se carichi immagini da altre fonti
    ],
  },
};

module.exports = nextConfig;
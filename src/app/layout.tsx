// src/app/layout.tsx

import type { Metadata } from "next";
// Rimuovi queste righe:
// import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";

// Importa Maven Pro e Open Sans da Google Fonts
import { Maven_Pro, Open_Sans } from "next/font/google";

import "./globals.css"; // Il tuo CSS globale
import Layout from "../../components/layout.js"; // Ho messo .tsx, se lo chiami .js usa .js

// Configura Maven Pro per i titoli
const mavenPro = Maven_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-maven-pro",
  weight: ["400", "500", "700", "900"],
});

// Configura Open Sans per il testo base
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sociale Sport",
  description: "Sito ufficiale di Sociale Sport ssd s.r.l.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        // Rimuovi le variabili Geist qui, usa solo quelle di Maven Pro e Open Sans
        className={`${mavenPro.variable} ${openSans.variable} antialiased`}
      >
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
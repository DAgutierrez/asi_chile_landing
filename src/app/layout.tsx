import type { Metadata } from "next";
export const dynamic = 'force-dynamic';
import Header from "./components/header";
import "./globals.css";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "tailwindcss";
import Footer from "./components/footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ThemeToggle from "./components/ThemeToggle";


const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans" });

export const metadata: Metadata = {
  title: "NewsFlash - Últimas Noticias",
  description: "Tras 620 días de agresión y genocidio en Palestina",
  openGraph: {
    title: "NewsFlash - Últimas Noticias",
    description: "Entregando las últimas noticias y actualizaciones de todo el mundo. Mantente informado con nuestra cobertura integral.",
    images: [
      {
        url: "https://69f7cd84c905.ngrok-free.app/ico.ico",
        width: 1200,
        height: 630,
        alt: "Imagen de portada",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <link rel="icon" href="/ico.ico" />
      <body className={`${playfair.variable} ${sourceSans.variable}`}>
        <div className="min-h-screen bg-gray-50 w-full"> 
          <ThemeToggle/>
          <Header />
          <div className="mx-auto px-4 py-4" style={{marginTop: "119px"}}>
            {children}             
          </div>  
        </div>
        <Footer />
        <WhatsAppButton/>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ThemeToggle from "./components/ThemeToggle";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans" });

export const metadata: Metadata = {
  title: "NewsFlash - Últimas Noticias",
  description: "Tras 620 días de agresión y genocidio en Palestina",
  icons: {
    icon: "/ico.ico",
  },
  openGraph: {
    title: "NewsFlash - Últimas Noticias",
    description:
      "Entregando las últimas noticias y actualizaciones de todo el mundo. Mantente informado con nuestra cobertura integral.",
    images: [
      {
        url: "https://alternativasocialista.cl/ico.ico",
        width: 1200,
        height: 630,
        alt: "Imagen de portada",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-gray-50 w-full">
          <ThemeToggle />
          <Header />
          <main className="mx-auto px-4 py-4" style={{ marginTop: "119px" }}>
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </body>
    </html>
  );
}

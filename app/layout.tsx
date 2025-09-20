// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LogoProvider } from "@/context/LogoContext";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";


const CartFab = dynamic(() => import("@/components/CartFab"), { ssr: false });
const WhatsAppFab = dynamic(() => import("@/components/WhatsAppFab"), { ssr: false });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Yo Tengo un Mini Pig Costa Rica",
  description: "Tu nuevo mejor amigo en Costa Rica. Mini pigs para adopción/venta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${poppins.variable} font-sans antialiased h-full bg-brand-background text-brand-dark`}>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] bg-white text-brand-dark rounded px-3 py-1 shadow">
          Saltar al contenido
        </a>
        <LogoProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              className: "text-sm rounded-full px-4 py-2",
              style: { background: "#4F342B", color: "#FFFFFF" },
            }}
          />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main id="contenido" className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <WhatsAppFab />
          <CartFab />
        </LogoProvider>
      </body>
    </html>
  );
}

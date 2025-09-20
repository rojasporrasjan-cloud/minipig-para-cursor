// app/adopciones/[id]/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mini pig | Yo Tengo un Mini Pig CR",
  description:
    "Conoce los detalles de este mini pig disponible en Costa Rica. Fotos, descripción y contacto por WhatsApp.",
  openGraph: {
    title: "Mini pig | Yo Tengo un Mini Pig CR",
    description:
      "Conoce los detalles de este mini pig disponible en Costa Rica. Fotos, descripción y contacto por WhatsApp.",
    images: [
      {
        url: "/og-pig.jpg", // 1200x630 en /public
        width: 1200,
        height: 630,
        alt: "Mini pig",
      },
    ],
    type: "article",
    locale: "es_CR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mini pig | Yo Tengo un Mini Pig CR",
    description:
      "Conoce los detalles de este mini pig disponible en Costa Rica. Fotos, descripción y contacto por WhatsApp.",
    images: ["/og-pig.jpg"],
  },
};

export default function PigDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

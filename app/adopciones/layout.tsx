// app/adopciones/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adopciones | Yo Tengo un Mini Pig CR",
  description:
    "Mini pigs disponibles en Costa Rica. Conoce a nuestros mini pigs y encuentra tu nuevo mejor amigo.",
  openGraph: {
    title: "Adopciones | Yo Tengo un Mini Pig CR",
    description:
      "Mini pigs disponibles en Costa Rica. Conoce a nuestros mini pigs y encuentra tu nuevo mejor amigo.",
    url: "https://tu-dominio.com/adopciones",
    siteName: "Yo Tengo un Mini Pig Costa Rica",
    images: [
      {
        url: "/og-adopciones.jpg", // coloca esta imagen (1200x630) en /public
        width: 1200,
        height: 630,
        alt: "Mini pigs en adopción",
      },
    ],
    locale: "es_CR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adopciones | Yo Tengo un Mini Pig CR",
    description:
      "Mini pigs disponibles en Costa Rica. Conoce a nuestros mini pigs y encuentra tu nuevo mejor amigo.",
    images: ["/og-adopciones.jpg"],
  },
};

export default function AdopcionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No se necesita ningún wrapper aquí
  return <>{children}</>;
}
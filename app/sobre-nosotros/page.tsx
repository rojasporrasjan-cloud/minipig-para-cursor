// app/sobre-nosotros/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Yo Tengo un Mini Pig CR',
  description:
    'Conoce nuestra historia, nuestra misión y la crianza responsable de mini pigs en Costa Rica. Acompañamiento, salud y socialización desde el primer día.',
  openGraph: {
    title: 'Sobre Nosotros | Yo Tengo un Mini Pig CR',
    description:
      'Crianza responsable de mini pigs en Costa Rica. Conoce nuestra historia, valores y compromiso.',
    url: process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/sobre-nosotros`
      : 'http://localhost:3000/sobre-nosotros',
    images: ['/og-pig.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Nosotros | Yo Tengo un Mini Pig CR',
    description:
      'Crianza responsable de mini pigs en Costa Rica. Conoce nuestra historia, valores y compromiso.',
    images: ['/og-pig.jpg'],
  },
};

export default function AboutUsPage() {
  return (
    <main>
      {/* ======= HERO ======= */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-pink-light via-white to-brand-background" />
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">
              Nuestra pasión son los <span className="text-brand-pink">Mini Pigs</span>
            </h1>
            <p className="mt-4 text-lg text-brand-text-muted">
              Más que un criadero, somos una familia dedicada al bienestar y la felicidad de
              cada cerdito. Acompañamos a cada familia con educación, salud y amor.
            </p>
          </div>

          {/* Stats de confianza */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-brand-border bg-white/90 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-brand-dark">+100</p>
              <p className="text-sm text-brand-text-muted">Adopciones felices</p>
            </div>
            <div className="rounded-xl border border-brand-border bg-white/90 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-brand-dark">4.9/5</p>
              <p className="text-sm text-brand-text-muted">Satisfacción</p>
            </div>
            <div className="rounded-xl border border-brand-border bg-white/90 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-brand-dark">100%</p>
              <p className="text-sm text-brand-text-muted">Entrega responsable</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======= HISTORIA ======= */}
      <section className="mx-auto max-w-3xl px-4 py-12 prose lg:prose-lg prose-rose">
        <h2>Nuestra Historia</h2>
        <p>
          “Yo Tengo un Mini Pig” nació de un amor profundo por estos animales inteligentes y
          cariñosos. Empezamos como familia con nuestro primer mini pig y nos dimos cuenta de la
          falta de información y apoyo para quienes querían compartir su vida con uno.
        </p>
        <p>
          Decidimos cambiar eso. Nuestra misión es clara: criar cerditos saludables, bien
          socializados y asegurar que encuentren un hogar para toda la vida, donde sean amados y
          comprendidos. Educamos a cada familia para que la experiencia sea positiva desde el
          primer día.
        </p>

        <div className="relative aspect-[2/1] my-8 shadow-lg rounded-xl overflow-hidden ring-1 ring-brand-border bg-white">
          <Image
            src="https://res.cloudinary.com/db4ld8cy2/image/upload/v1758221449/t0soj7ltzftnp5i9mszr.jpg"
            alt="Equipo de Yo Tengo un Mini Pig Costa Rica"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 700px"
            priority={false}
          />
        </div>

        <h2>Nuestra Filosofía de Crianza</h2>
        <ul>
          <li>
            <strong>Salud primero:</strong> controles veterinarios, vacunas y desparasitación
            al día.
          </li>
          <li>
            <strong>Socialización temprana:</strong> crecen en ambiente familiar, con contacto
            humano y otros animales.
          </li>
          <li>
            <strong>Educación y soporte:</strong> guía antes, durante y después de la adopción.
          </li>
          <li>
            <strong>Ética y compromiso:</strong> ponemos el bienestar del mini pig por encima de
            todo.
          </li>
        </ul>

        <p>
          Creemos que un mini pig no es “solo una mascota”, es un miembro de la familia.
          Gracias por considerar unirte a esta comunidad que los valora con respeto y cariño.
        </p>
      </section>

      {/* ======= LÍNEA DE TIEMPO / HITOS ======= */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-brand-border bg-white/90 p-5">
            <h3 className="font-bold text-brand-dark">Nuestros inicios</h3>
            <p className="mt-1 text-sm text-brand-text-muted">
              Inspirados por el primer mini pig en casa, iniciamos el camino de la crianza
              responsable y la educación familiar.
            </p>
          </div>
          <div className="rounded-xl border border-brand-border bg-white/90 p-5">
            <h3 className="font-bold text-brand-dark">Crianza con propósito</h3>
            <p className="mt-1 text-sm text-brand-text-muted">
              Mejoramos procesos de socialización, salud y entrega, con seguimiento a cada
              familia.
            </p>
          </div>
          <div className="rounded-xl border border-brand-border bg-white/90 p-5">
            <h3 className="font-bold text-brand-dark">Comunidad</h3>
            <p className="mt-1 text-sm text-brand-text-muted">
              Creamos una red de soporte y aprendizaje para dueños responsables de mini pigs en
              Costa Rica.
            </p>
          </div>
        </div>
      </section>

      {/* ======= GALERÍA (scroll horizontal) ======= */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-xl md:text-2xl font-bold text-brand-dark">Momentos que nos inspiran</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* TODO: Reemplaza por tus fotos reales */}
          <div className="relative h-40 w-64 shrink-0 rounded-xl overflow-hidden ring-1 ring-brand-border bg-white">
            <Image src="/og-pig.jpg" alt="Mini pig feliz 1" fill className="object-cover" />
          </div>
          <div className="relative h-40 w-64 shrink-0 rounded-xl overflow-hidden ring-1 ring-brand-border bg-white">
            <Image src="/og-adopciones.jpg" alt="Mini pig feliz 2" fill className="object-cover" />
          </div>
          <div className="relative h-40 w-64 shrink-0 rounded-xl overflow-hidden ring-1 ring-brand-border bg-white">
            <Image src="/og-pig.jpg" alt="Mini pig feliz 3" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-gradient-to-r from-rose-100 to-pink-100 p-8 md:p-10 text-center">
          <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-pink-light blur-2xl opacity-60" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-brand-pink-light blur-2xl opacity-60" />

          <h3 className="text-2xl md:text-3xl font-bold text-brand-dark">
            ¿Listo para conocer a tu mini pig?
          </h3>
          <p className="mt-2 text-brand-text-muted max-w-2xl mx-auto">
            Te guiamos paso a paso. Escríbenos por WhatsApp o mira los cerditos disponibles.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/adopciones" className="btn-pig px-5 py-2.5 text-sm">
              Ver cerditos disponibles
            </Link>
            <a
              href={`https://wa.me/50672752645?text=${encodeURIComponent(
                '¡Hola! Vi la página Sobre Nosotros y me interesa adoptar un mini pig 🐷'
              )}&utm_source=about&utm_medium=whatsapp&utm_campaign=about_whatsapp`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-pig px-5 py-2.5 text-sm"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ======= JSON-LD (SEO) ======= */}
      <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Yo Tengo un Mini Pig Costa Rica',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          description:
            'Crianza responsable de mini pigs en Costa Rica: salud, socialización y acompañamiento familiar.',
          sameAs: [
            // TODO: agrega tus enlaces oficiales cuando estén listos:
            // "https://www.instagram.com/TU_USUARIO",
            // "https://www.facebook.com/TU_PAGINA"
          ],
          logo:
            process.env.NEXT_PUBLIC_SITE_URL
              ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-pig.jpg`
              : '/og-pig.jpg',
        })}
      </Script>
    </main>
  );
}

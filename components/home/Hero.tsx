// components/home/Hero.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { buildWhatsAppLink, trackWhatsAppClick } from '@/lib/whatsapp';

/** WhatsApp oficial (círculo verde + glifo blanco) */
const WhatsAppIconOriginal = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      fill="#FFFFFF"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.149-.198.297-.767.966-.94 1.165-.174.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.297.298-.496.1-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.205-.243-.58-.487-.502-.672-.512l-.573-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z"
    />
  </svg>
);

export default function Hero() {
  const waLink = buildWhatsAppLink({ context: 'home-hero' });

  return (
    <section className="relative isolate overflow-hidden min-h-[90vh] flex items-center">
      {/* Fondo mejorado con múltiples capas */}
      <div className="absolute inset-0 -z-10">
        {/* Degradé principal */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-light/40 via-brand-background to-white" />
        {/* Patrón sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(247,140,182,0.1),transparent)] opacity-60" />
        {/* Elementos decorativos flotantes */}
        <div className="pointer-events-none absolute top-20 left-10 h-64 w-64 rounded-full bg-gradient-to-r from-brand-pink-light/30 to-transparent blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-gradient-to-l from-brand-pink/20 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Texto mejorado */}
          <div className="animate-fade-in-up space-y-8">
            {/* Badge superior */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-brand-border px-4 py-2 text-sm font-medium text-brand-dark shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              +120 familias felices en Costa Rica
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="block text-brand-dark leading-[0.9]">Tu</span>
                <span className="block bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent leading-[0.9]">Mini Pig</span>
                <span className="block text-brand-dark text-3xl md:text-4xl lg:text-5xl font-bold mt-2 opacity-90">ideal en Costa Rica</span>
              </h1>
              
              <p className="text-xl md:text-2xl leading-relaxed text-brand-text-muted max-w-2xl font-light">
                Mini pigs criados con amor, socializados y listos para integrarse a tu familia.
                <span className="block mt-2 font-medium text-brand-dark">Acompañamiento completo en cada paso.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/adopciones"
                className="group relative overflow-hidden rounded-full bg-brand-pink hover:bg-brand-pink-dark px-8 py-4 text-white font-bold text-lg transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95"
                aria-label="Ver cerditos disponibles"
                title="Ver cerditos disponibles"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Ver cerditos disponibles
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-pink-dark to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <a
                href={waLink}
                onClick={() => trackWhatsAppClick('home-hero')}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-full bg-white/90 backdrop-blur-sm border-2 border-brand-border hover:border-green-400 px-8 py-4 text-brand-dark hover:text-green-700 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                aria-label="Hablar por WhatsApp"
                title="Hablar por WhatsApp"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <WhatsAppIconOriginal className="h-6 w-6" />
                  Hablar por WhatsApp
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>

            {/* Trust badges mejorados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-3 rounded-xl bg-white/70 backdrop-blur-sm border border-brand-border p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">Garantía de salud</p>
                  <p className="text-xs text-brand-text-muted">Controles veterinarios</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-xl bg-white/70 backdrop-blur-sm border border-brand-border p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">🏡</span>
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">Asesoría completa</p>
                  <p className="text-xs text-brand-text-muted">Post-adopción</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-xl bg-white/70 backdrop-blur-sm border border-brand-border p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-lg">📄</span>
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">Guía de cuidados</p>
                  <p className="text-xs text-brand-text-muted">Paso a paso</p>
                </div>
              </div>
            </div>
          </div>

          {/* Imagen mejorada */}
          <div className="relative animate-fade-in-up lg:justify-self-end" style={{ animationDelay: '0.3s' }}>
            <div className="relative group">
              {/* Contenedor principal de la imagen */}
              <div className="relative mx-auto w-full max-w-[580px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20 bg-white transform transition-transform duration-700 group-hover:scale-105">
                <Image
                  src="/og-pig.jpg"
                  alt="Mini pig adorable listo para adopción"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 580px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ position: 'absolute' }}
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Elementos decorativos mejorados */}
              <div className="pointer-events-none absolute -z-10 -top-8 -left-8 h-48 w-48 rounded-full bg-gradient-to-br from-brand-pink-light/60 to-brand-pink/40 blur-3xl animate-pulse" />
              <div className="pointer-events-none absolute -z-10 -bottom-8 -right-8 h-56 w-56 rounded-full bg-gradient-to-tl from-brand-pink/50 to-brand-pink-light/60 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Floating elements */}
              <div className="pointer-events-none absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                <span className="text-2xl">🐷</span>
              </div>
              
              <div className="pointer-events-none absolute bottom-6 left-6 w-16 h-16 rounded-full bg-brand-pink/20 backdrop-blur-sm border border-brand-pink/30 flex items-center justify-center animate-bounce" style={{ animationDelay: '1.5s' }}>
                <span className="text-xl">💕</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

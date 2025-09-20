// app/page.tsx
import Hero from '@/components/home/Hero';
import ValueProps from '@/components/home/ValueProps';
import PigOfTheMonth from '@/components/home/PigOfTheMonth';
import FeaturedPigs from '@/components/home/FeaturedPigs';
import AdoptionSteps from '@/components/home/AdoptionSteps';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
import FAQ from '@/components/home/FAQ';
import Newsletter from '@/components/Newsletter';
import Link from 'next/link';
import Script from 'next/script';

/* ================== Config ================== */
const WHATSAPP_NUMBER = "50672752645";

function waUrl(message: string, utm: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}&${utm}`;
}

/* ================== Iconos inline (ligeros) ================== */
const HeartIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.1 21.35l-.1.1-.11-.1C7.14 17.24 4 14.39 4 11.28 4 9 5.79 7.2 8.05 7.2c1.22 0 2.4.56 3.15 1.44a4.23 4.23 0 013.15-1.44C18.21 7.2 20 9 20 11.28c0 3.11-3.14 5.96-7.9 10.07z"/>
  </svg>
);

const StarIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.786 1.401 8.168L12 18.896l-7.335 3.869 1.401-8.168L.132 9.211l8.2-1.193L12 .587z"/>
  </svg>
);

const ShieldIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2l7 4v6c0 5-3.5 9.74-7 10-3.5-.26-7-5-7-10V6l7-4z"/>
  </svg>
);

const PawIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 13c-2.5 0-5 2-5 4.5S9.5 22 12 22s5-2 5-4.5S14.5 13 12 13zm-5.5-1C8.43 12 10 10.43 10 8.5S8.43 5 6.5 5 3 6.57 3 8.5 4.57 12 6.5 12zm11 0C19.43 12 21 10.43 21 8.5S19.43 5 17.5 5 14 6.57 14 8.5s1.57 3.5 3.5 3.5zM9.5 4C10.33 4 11 3.33 11 2.5S10.33 1 9.5 1 8 1.67 8 2.5 8.67 4 9.5 4zm5 0C15.33 4 16 3.33 16 2.5S15.33 1 14.5 1 13 1.67 13 2.5 13.67 4 14.5 4z"/>
  </svg>
);

/* WhatsApp oficial (círculo verde + glifo blanco) */
const WhatsAppIconOriginal = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      fill="#FFFFFF"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.149-.198.297-.767.966-.94 1.165-.174.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.297.298-.496.1-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.205-.243-.58-.487-.502-.672-.512l-.573-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z"
    />
  </svg>
);

/* ================== Pequeños componentes inline ================== */

/** Tira de stats inmediatamente bajo el Hero (confianza y contexto) */
function StatsStrip() {
  const stats = [
    {
      icon: PawIcon,
      title: "+120 adopciones felices",
      subtitle: "Familias en Costa Rica",
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      delay: "0s"
    },
    {
      icon: ShieldIcon,
      title: "Entrega responsable",
      subtitle: "Acompañamiento y guía inicial",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      delay: "0.1s"
    },
    {
      icon: StarIcon,
      title: "Valoración 4.9/5",
      subtitle: "Clientes verificados",
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-50",
      delay: "0.2s"
    }
  ];

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-background/20 to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.title}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: stat.delay }}
            >
              {/* Card mejorada */}
              <div className="relative h-full rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 p-6">
                
                {/* Contenido */}
                <div className="flex items-center gap-4">
                  {/* Icono con gradiente */}
                  <div className="relative flex-shrink-0">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} opacity-20 blur-lg transition-opacity duration-300 group-hover:opacity-40`} />
                  </div>

                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-dark text-lg group-hover:text-brand-pink-dark transition-colors duration-300 truncate">
                      {stat.title}
                    </p>
                    <p className="text-brand-text-muted text-sm group-hover:text-brand-dark transition-colors duration-300">
                      {stat.subtitle}
                    </p>
                  </div>
                </div>

                {/* Elementos decorativos */}
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-pink opacity-20 group-hover:opacity-60 transition-all duration-300" />
                <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-brand-pink-dark opacity-30 group-hover:opacity-80 transition-all duration-300" />
                
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-brand-pink-light/0 group-hover:to-brand-pink-light/5 transition-all duration-500" />
              </div>

              {/* Background blur effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-3 blur-xl transition-all duration-500 -z-10`} />
            </div>
          ))}
        </div>

        {/* Línea decorativa */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
            <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
            <div className="w-16 h-px bg-gradient-to-r from-brand-pink/30 to-brand-pink-dark/30" />
            <div className="w-2 h-2 rounded-full bg-brand-pink-dark animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-8 h-px bg-gradient-to-r from-brand-pink-dark/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Barrita de confianza (badges) antes del CTA final */
function AssuranceBar() {
  const badges = [
    { emoji: '🐷', text: 'Mini pigs criados con amor', delay: '0s' },
    { emoji: '📦', text: 'Entrega responsable', delay: '0.1s' },
    { emoji: '📱', text: 'Soporte por WhatsApp', delay: '0.2s' },
    { emoji: '🔒', text: 'Compromiso ético', delay: '0.3s' },
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-background/10 to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4">
        {/* Título de sección */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-brand-dark mb-2">
            Nuestra <span className="gradient-text-brand">promesa</span>
          </h3>
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
            <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
          </div>
        </div>

        {/* Badges mejorados */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {badges.map((badge, index) => (
            <div 
              key={badge.text}
              className="group animate-fade-in-up hover-lift"
              style={{ animationDelay: badge.delay }}
            >
              <div className="relative overflow-hidden rounded-full bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-brand transition-all duration-300 px-6 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg group-hover:animate-bounce-gentle">{badge.emoji}</span>
                  <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-pink-dark transition-colors duration-300">
                    {badge.text}
                  </span>
                </div>
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 animate-shimmer rounded-full" />
                </div>
                
                {/* Subtle glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-pink-light/0 via-brand-pink-light/0 to-brand-pink-light/0 group-hover:from-brand-pink-light/5 group-hover:via-brand-pink-light/10 group-hover:to-brand-pink-light/5 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Decoración inferior */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-1 h-1 rounded-full bg-brand-pink/40 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** CTA final con degradé suave y botón WhatsApp oficial */
function FinalCTA() {
  const msg = "Hola 👋, quiero información para adoptar un mini pig 🐷.";
  const href = waUrl(msg, "utm_source=homepage&utm_medium=cta_final&utm_campaign=home_whatsapp");

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fondo con múltiples capas */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-light/30 via-brand-background to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(247,140,182,0.1),transparent)] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(224,114,154,0.05),transparent)] opacity-60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="relative">
          {/* Card principal mejorada */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-12 lg:p-16">
            
            {/* Decoraciones de fondo mejoradas */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-brand-pink-light/40 to-brand-pink/30 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-tl from-brand-pink/20 to-brand-pink-light/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Elementos flotantes decorativos */}
            <div className="pointer-events-none absolute top-8 right-8 w-16 h-16 rounded-full bg-brand-pink/10 backdrop-blur-sm border border-brand-pink/20 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
              <span className="text-2xl">🐷</span>
            </div>
            <div className="pointer-events-none absolute bottom-8 left-8 w-12 h-12 rounded-full bg-brand-pink-light/20 backdrop-blur-sm border border-brand-pink-light/30 flex items-center justify-center animate-bounce" style={{ animationDelay: '2s' }}>
              <span className="text-xl">💕</span>
            </div>

            <div className="relative text-center space-y-8">
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                ¡Último paso!
              </div>

              {/* Título principal */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark leading-tight">
                  ¿Listo para conocer a tu
                  <span className="block bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent">
                    mini pig ideal?
                  </span>
                </h2>
                
                <div className="flex items-center justify-center gap-3 text-brand-pink">
                  <HeartIcon className="h-8 w-8 animate-pulse" />
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-brand-pink to-transparent" />
                  <HeartIcon className="h-6 w-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-brand-pink to-transparent" />
                  <HeartIcon className="h-8 w-8 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>

              {/* Descripción */}
              <p className="text-xl md:text-2xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
                Escríbenos por WhatsApp sin compromiso y te guiaremos en cada paso para encontrar a tu compañero ideal.
                <span className="block mt-2 font-semibold text-brand-dark">¡Respuesta inmediata garantizada!</span>
              </p>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-4 text-white font-bold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 active:scale-95 min-w-[280px]"
                  aria-label="Hablar por WhatsApp"
                  title="Hablar por WhatsApp"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <WhatsAppIconOriginal className="h-6 w-6" />
                    Hablar por WhatsApp ahora
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>

                <div className="text-center space-y-2">
                  <p className="text-sm text-brand-text-muted">o llama directamente</p>
                  <a href="tel:+50672752645" className="text-brand-pink hover:text-brand-pink-dark font-semibold text-lg transition-colors">
                    +506 7275-2645
                  </a>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-brand-border/30">
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-brand-pink">⚡</div>
                  <div className="text-sm text-brand-text-muted">Respuesta inmediata</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-brand-pink">🔒</div>
                  <div className="text-sm text-brand-text-muted">Sin compromiso</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-brand-pink">🎯</div>
                  <div className="text-sm text-brand-text-muted">Asesoría personalizada</div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-brand-pink">💝</div>
                  <div className="text-sm text-brand-text-muted">Acompañamiento total</div>
                </div>
              </div>
            </div>

            {/* Patrón decorativo sutil */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(247,140,182,0.02),transparent)] opacity-60" />
          </div>

          {/* Glow effect exterior */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-pink/10 via-brand-pink-light/10 to-brand-pink/10 blur-xl opacity-60 -z-10" />
        </div>
      </div>
    </section>
  );
}

/* ================== Página ================== */
export default function HomePage() {
  return (
    <>
      {/* SEO básico JSON-LD (Organization) */}
      <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Yo Tengo un Mini Pig Costa Rica",
          "url": process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
          "sameAs": [
            // TODO: agrega Instagram/Facebook cuando estén listos
          ],
        })}
      </Script>

      <Hero />
      <StatsStrip />
      <PigOfTheMonth />
      <ValueProps />
      <FeaturedPigs />
      <AdoptionSteps />
      <Testimonials />
      <BlogPreview />
      <FAQ />
      <Newsletter />

      <AssuranceBar />
      <FinalCTA />
    </>
  );
}

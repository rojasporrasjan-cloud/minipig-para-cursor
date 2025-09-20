// components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

/* ================== Config ================== */
const WHATSAPP_NUMBER = "50672752645";

/* ================== Iconos ================== */
const FacebookIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="currentColor">
    <path d="M22 12.06C22 6.49 17.52 2 11.94 2 6.37 2 1.88 6.49 1.88 12.06c0 4.89 3.57 8.94 8.24 9.86v-6.98H7.99v-2.88h2.13V9.6c0-2.1 1.25-3.26 3.16-3.26.92 0 1.88.16 1.88.16v2.06h-1.06c-1.04 0-1.36.64-1.36 1.3v1.56h2.31l-.37 2.88h-1.94v6.98c4.67-.92 8.24-4.97 8.24-9.86Z" />
  </svg>
);

const InstagramIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="currentColor">
    <path d="M12 2.2c3.26 0 3.66.01 4.95.07 3.03.14 4.46 1.56 4.6 4.6.06 1.29.07 1.69.07 4.95s-.01 3.66-.07 4.95c-.14 3.03-1.56 4.46-4.6 4.6-1.29.06-1.69.07-4.95.07s-3.66-.01-4.95-.07c-3.03-.14-4.46-1.56-4.6-4.6C2.2 15.66 2.2 15.26 2.2 12s.01-3.66.07-4.95c.14-3.03 1.56-4.46 4.6-4.6C8.34 2.2 8.74 2.2 12 2.2Zm0-2.2C8.7 0 8.27.01 6.98.07 2.87.26.26 2.87.07 6.98.01 8.27 0 8.7 0 12c0 3.3.01 3.73.07 5.02.19 4.11 2.8 6.72 6.91 6.91C8.27 23.99 8.7 24 12 24c3.3 0 3.73-.01 5.02-.07 4.11-.19 6.72-2.8 6.91-6.91.06-1.29.07-1.72.07-5.02 0-3.3-.01-3.73-.07-5.02C23.74 2.87 21.13.26 17.02.07 15.73.01 15.3 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.12A3.96 3.96 0 1 1 15.96 12 3.96 3.96 0 0 1 12 15.96ZM18.4 4.7a1.44 1.44 0 1 0 1.44 1.44A1.44 1.44 0 0 0 18.4 4.7Z" />
  </svg>
);

const WhatsAppIconOriginal = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      fill="#FFFFFF"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.149-.198.297-.767.966-.94 1.165-.174.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.297.298-.496.1-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.205-.243-.58-.487-.502-.672-.512l-.573-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z"
    />
  </svg>
);

/* ================== Skins ================== */
export type FooterSkin = "cocoa" | "night-rose" | "onyx" | "pearl";

const SKINS: Record<FooterSkin, {
  wrapper: string;
  divider: string;
  topBar: string; // gradient colors
  heading: string;
  text: string;
  link: string;
  socialBtn: string;
  scrollTop: string;
}> = {
  cocoa: {
    wrapper: "bg-brand-dark text-white/90 border-t border-white/10",
    divider: "border-white/10",
    topBar: "from-brand-pink via-brand-pink-light to-brand-pink-dark",
    heading: "text-white",
    text: "text-white/75",
    link: "text-white/75 hover:text-brand-pink-light",
    socialBtn: "bg-white/5 text-white ring-1 ring-white/15 hover:bg-white/10 hover:ring-brand-pink",
    scrollTop: "hover:text-brand-pink-light",
  },
  "night-rose": {
    wrapper: "bg-[#3B2C33] text-white/90 border-t border-white/10",
    divider: "border-white/10",
    topBar: "from-brand-pink via-brand-pink to-brand-pink-dark",
    heading: "text-white",
    text: "text-white/75",
    link: "text-white/80 hover:text-brand-pink-light",
    socialBtn: "bg-white/5 text-white ring-1 ring-white/20 hover:bg-white/10 hover:ring-brand-pink",
    scrollTop: "hover:text-brand-pink-light",
  },
  onyx: {
    wrapper: "bg-[#0E0F10] text-white/90 border-t border-white/10",
    divider: "border-white/10",
    topBar: "from-brand-pink-dark via-brand-pink to-brand-pink-light",
    heading: "text-white",
    text: "text-white/70",
    link: "text-white/75 hover:text-brand-pink-light",
    socialBtn: "bg-white/5 text-white ring-1 ring-white/15 hover:bg-white/10 hover:ring-brand-pink",
    scrollTop: "hover:text-brand-pink-light",
  },
  pearl: {
    wrapper: "bg-brand-background text-brand-dark border-t border-brand-border",
    divider: "border-brand-border",
    topBar: "from-brand-pink via-brand-pink-light to-brand-pink-dark",
    heading: "text-brand-dark",
    text: "text-brand-text-muted",
    link: "text-brand-dark hover:text-brand-pink-dark",
    socialBtn: "bg-white text-brand-dark ring-1 ring-brand-border hover:bg-brand-pink-light hover:ring-brand-pink",
    scrollTop: "hover:text-brand-pink-dark",
  },
};

/* ============== Social Button (usa clases del skin) ============== */
function SocialButton({
  href, label, children, skinClasses,
}: {
  href: string; label: string; children: React.ReactNode; skinClasses: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${skinClasses}`}
    >
      {children}
    </a>
  );
}

/* ================== Footer ================== */
export default function Footer({
  skin = "cocoa",
  showBadges = true,
}: {
  /** Elegir estilo visual del footer */
  skin?: FooterSkin;
  /** Mostrar/ocultar badges de confianza */
  showBadges?: boolean;
}) {
  const s = SKINS[skin];
  const year = new Date().getFullYear();

  return (
    <footer className={`relative mt-20 ${s.wrapper}`}>
      {/* Elementos decorativos mejorados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-brand-pink-light/10 to-brand-pink/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-tl from-brand-pink/5 to-brand-pink-light/10 blur-3xl" />
      </div>
      
      {/* Barra degradada superior mejorada */}
      <div className={`pointer-events-none absolute inset-x-0 -top-px h-2 bg-gradient-to-r ${s.topBar}`} />

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + copy + CTA */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-32">
                <Image
                  src="https://res.cloudinary.com/db4ld8cy2/image/upload/v1758221449/t0soj7ltzftnp5i9mszr.jpg"
                  alt="Logo Yo Tengo un Mini Pig"
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
              <span className={`hidden sm:inline text-lg font-extrabold tracking-tight ${s.heading}`}>
                Yo Tengo un <span className="text-brand-pink">Mini Pig</span>
              </span>
            </Link>

            <p className={`mt-4 max-w-md text-sm leading-relaxed ${s.text}`}>
              Criamos mini pigs felices en Costa Rica con amor y responsabilidad. Descubre el compañero perfecto para tu familia. 🐷✨
            </p>

            {/* CTA WhatsApp */}
            <div className="mt-5">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `¡Hola! Vi su sitio "Yo Tengo un Mini Pig" y quiero más info 🐷✨`
                )}&utm_source=footer&utm_medium=whatsapp&utm_campaign=site_footer`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-white text-sm font-semibold shadow-sm transition hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
              >
                {/* Icono oficial de WhatsApp */}
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
                  <circle cx="12" cy="12" r="12" fill="#25D366" />
                  <path
                    fill="#FFFFFF"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.149-.198.297-.767.966-.94 1.165-.174.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.297.298-.496.1-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.205-.243-.58-.487-.502-.672-.512l-.573-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z"
                  />
                </svg>
                Escríbenos por WhatsApp
              </a>
            </div>

            {/* Badges de confianza (opcionales) */}
            {showBadges && (
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                <li className="rounded-full px-3 py-1 ring-1 ring-inset ring-white/10 bg-white/5 text-white/75">
                  Asesoría antes de adoptar
                </li>
                <li className="rounded-full px-3 py-1 ring-1 ring-inset ring-white/10 bg-white/5 text-white/75">
                  Entrega responsable
                </li>
                <li className="rounded-full px-3 py-1 ring-1 ring-inset ring-white/10 bg-white/5 text-white/75">
                  Cuidados y guía inicial
                </li>
              </ul>
            )}
          </div>

          {/* Navegación */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${s.heading}`}>Navegación</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/adopciones" className={`${s.link}`}>Adopciones</Link></li>
              <li><Link href="/tienda" className={`${s.link}`}>Tienda</Link></li>
              <li><Link href="/blog" className={`${s.link}`}>Blog</Link></li>
              <li><Link href="/sobre-nosotros" className={`${s.link}`}>Sobre Nosotros</Link></li>
            </ul>
          </div>

          {/* Soporte + Social */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${s.heading}`}>Soporte</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/contacto" className={`${s.link}`}>Contacto</Link></li>
              <li><Link href="/politica-de-privacidad" className={`${s.link}`}>Política de Privacidad</Link></li>
              <li><Link href="/terminos-y-condiciones" className={`${s.link}`}>Términos y Condiciones</Link></li>
            </ul>

            {/* Redes sociales */}
            <div className="mt-6">
              <h4 className={`text-sm font-semibold ${s.heading}`}>Síguenos</h4>
              <div className="mt-3 flex items-center gap-3">
                {/* TODO: Reemplaza '#' por tu enlace oficial de Facebook */}
                <SocialButton href="#" label="Facebook (pronto)" skinClasses={s.socialBtn}>
                  <FacebookIcon />
                </SocialButton>

                {/* TODO: Reemplaza '#' por tu enlace oficial de Instagram */}
                <SocialButton href="#" label="Instagram (pronto)" skinClasses={s.socialBtn}>
                  <InstagramIcon />
                </SocialButton>
              </div>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div className={`mt-12 border-t pt-6 ${s.divider}`}>
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p className={`${s.text}`}>© {year} Yo Tengo un Mini Pig. Todos los derechos reservados.</p>
            <nav className="flex items-center gap-4">
              <Link href="/politica-de-privacidad" className={`${s.link}`}>Privacidad</Link>
              <Link href="/terminos-y-condiciones" className={`${s.link}`}>Términos</Link>
              <a href="#contenido" className={`${s.link} ${s.scrollTop}`}>Subir ↑</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

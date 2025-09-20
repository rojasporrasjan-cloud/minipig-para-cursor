"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAdminGate } from "@/hooks/useAdmins";
import { useCart } from "@/hooks/useCart";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { avatars } from "@/components/admin/PigAvatars";
import Image from "next/image";

/* === Iconos === */
const CartIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
  </svg>
);
const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
  </svg>
);
const CloseIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

/* WhatsApp oficial (círculo verde + glifo blanco, centrado y nítido) */
const WhatsAppIconOriginal = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      fill="#FFFFFF"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.149-.198.297-.767.966-.94 1.165-.174.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.297.298-.496.1-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.205-.243-.58-.487-.502-.672-.512l-.573-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z"
    />
  </svg>
);

/* Navegación */
const NAV_ITEMS = [
  { href: "/adopciones", label: "Adopciones" },
  { href: "/tienda", label: "Tienda" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
  { href: "/favoritos", label: "Favoritos" },
];

const WHATSAPP_NUMBER = "50672752645";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // ← importante para evitar texto distinto en SSR/CSR

  const { user, userProfile, loading } = useUserProfile();
  const { allowed } = useAdminGate();
  const { count: cartCount } = useCart();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const CurrentAvatar = userProfile?.avatar ? (avatars as any)[userProfile.avatar] : null;

  useEffect(() => setMounted(true), []);

  /* Cerrar menú de usuario al hacer click fuera */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside as any, { passive: true } as any);
    return () => document.removeEventListener("mousedown", handleClickOutside as any);
  }, []);

  /* Header “glass” al hacer scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cerrar menús con ESC */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Bloquear scroll cuando el menú móvil está abierto */
  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = original; };
    }
  }, [mobileMenuOpen]);

  const handleMobileNav = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await signOut(auth);
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const hasItems = (cartCount ?? 0) > 0;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-glass" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* --- LOGO Y TÍTULO --- */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <div className="relative h-12 w-32">
                  <Image
                    src="https://res.cloudinary.com/db4ld8cy2/image/upload/v1758221449/t0soj7ltzftnp5i9mszr.jpg"
                    alt="Logo Yo Tengo un Mini Pig"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 1024px) 128px, 160px"
                  />
                </div>
                <span className="hidden lg:inline text-xl font-extrabold tracking-tight text-brand-dark">
                  Yo Tengo un <span className="text-brand-pink">Mini Pig</span>
                </span>
              </Link>
            </div>

            {/* --- NAVEGACIÓN DESKTOP (fix: span siempre presente) --- */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-[15px] font-semibold tracking-[0.015em] transition-colors underline-offset-4 ${
                      active
                        ? "text-brand-dark"
                        : "text-brand-text-muted hover:text-brand-pink-dark hover:underline decoration-brand-pink/60"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}

                    {/* SIEMPRE renderizado → solo visibilidad cambia */}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-brand-pink transition
                      ${active ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* --- ACCIONES DERECHA --- */}
            <div className="flex items-center gap-3">
              {/* WhatsApp con logo oficial */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `¡Hola! Vi ${pathname} en "Yo Tengo un Mini Pig" y quiero más info 🐷✨`
                )}&utm_source=navbar&utm_medium=whatsapp&utm_campaign=site_navbar&utm_content=${encodeURIComponent(
                  pathname || "/"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir WhatsApp"
                className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-full transition-colors hover:bg-black/5"
                title="Contactar por WhatsApp"
              >
                <WhatsAppIconOriginal />
              </a>

              {/* Carrito (fix: span de badge siempre presente) */}
              <Link
                href="/tienda/cart"
                aria-label="Abrir carrito"
                className="relative p-2 rounded-full text-brand-dark bg-brand-pink-light hover:bg-brand-pink hover:text-white transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2"
              >
                <CartIcon />
                <span
                  aria-hidden={!hasItems}
                  suppressHydrationWarning
                  className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-white transition
                    ${hasItems ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                >
                  {/* Texto solo tras mount para evitar mismatch SSR/CSR en el número */}
                  {mounted && hasItems ? cartCount : ""}
                </span>
              </Link>

              {/* Botón/Menú de Perfil */}
              {loading ? (
                <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    id="user-menu-button"
                    onClick={() => setUserMenuOpen((o) => !o)}
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-controls="user-menu"
                    className="block rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ring-transparent focus-visible:ring-brand-pink"
                  >
                    {CurrentAvatar ? (
                      <CurrentAvatar className="w-9 h-9" />
                    ) : (
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=FFDDEE&color=4F342B`}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full"
                      />
                    )}
                  </button>

                  {userMenuOpen && (
                    <div
                      id="user-menu"
                      role="menu"
                      aria-labelledby="user-menu-button"
                      className="animate-slide-down-fade absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-brand-border focus:outline-none"
                    >
                      {/* caret */}
                      <span className="pointer-events-none absolute -top-2 right-6 h-3 w-3 rotate-45 bg-white/90 border-l border-t border-brand-border"></span>

                      <div className="py-2">
                        <div className="px-4 pb-3 mb-2 border-b border-brand-border">
                          <p className="text-sm font-semibold truncate text-brand-dark">
                            {user.displayName || "Usuario"}
                          </p>
                          <p className="text-xs text-brand-text-muted truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/mi-cuenta"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-pink-light rounded-md mx-1"
                        >
                          Mi Cuenta
                        </Link>

                        {allowed && (
                          <Link
                            href="/admin"
                            role="menuitem"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-pink-light rounded-md mx-1"
                          >
                            Panel de Control
                          </Link>
                        )}

                        <Link
                          href="/configuracion"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-pink-light rounded-md mx-1"
                        >
                          Configuración
                        </Link>

                        <div className="mt-2 border-t border-brand-border pt-2">
                          <button
                            onClick={handleLogout}
                            role="menuitem"
                            className="flex w-[calc(100%-0.5rem)] mx-1 items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
                          >
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center rounded-full border border-brand-border bg-white text-brand-dark px-4 py-2 text-[13px] font-semibold tracking-[0.02em] hover:bg-brand-pink-light hover:text-brand-pink-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2"
                >
                  Ingresar
                </Link>
              )}

              {/* Toggle móvil */}
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((o) => !o)}
                  aria-label="Abrir menú móvil"
                  aria-controls="mobile-menu"
                  aria-expanded={mobileMenuOpen}
                  className="p-2 rounded-md text-brand-dark hover:bg-brand-pink-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2"
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ====== Menú móvil (sheet) ====== */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-brand-background/95 backdrop-blur-lg border-t border-brand-border animate-slide-down-fade"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-4 pt-4 pb-6 space-y-4 overflow-y-auto h-full">
              <nav className="flex flex-col space-y-2">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleMobileNav(item.href)}
                      className={`px-4 py-3 text-left rounded-lg font-medium text-[15px] tracking-[0.015em] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink ${
                        active
                          ? "bg-brand-pink-light text-brand-pink-dark"
                          : "text-brand-dark hover:bg-brand-pink-light/70"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="border-t border-brand-border pt-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `¡Hola! Vi ${pathname} en "Yo Tengo un Mini Pig" y quiero más info 🐷✨`
                  )}&utm_source=navbar&utm_medium=whatsapp&utm_campaign=site_navbar&utm_content=${encodeURIComponent(
                    pathname || "/"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 px-4 py-3 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                >
                  <WhatsAppIconOriginal className="h-5 w-5" />
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

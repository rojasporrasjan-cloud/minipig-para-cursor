// app/admin/access-denied/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-pink-light/30 via-brand-background to-white">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* Icono de acceso denegado */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto shadow-2xl">
          <span className="text-4xl text-white">🚫</span>
        </div>

        {/* Mensaje principal */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-brand-dark">
            Acceso 
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent"> Denegado</span>
          </h1>
          <p className="text-xl text-brand-text-muted leading-relaxed">
            Lo sentimos, no tienes permisos para acceder al panel de administración.
          </p>
          <p className="text-sm text-brand-text-muted">
            Solo los administradores autorizados pueden ver esta sección.
          </p>
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-bold transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver al Inicio
            </Link>

            <button 
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-brand-border hover:border-brand-pink px-6 py-3 text-brand-dark hover:text-brand-pink-dark font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver Atrás
            </button>
          </div>

          {/* Información de contacto */}
          <div className="pt-6 border-t border-brand-border/30">
            <p className="text-sm text-brand-text-muted mb-4">
              ¿Necesitas acceso de administrador?
            </p>
            <a
              href="https://wa.me/50672752645?text=Hola%2C%20necesito%20acceso%20de%20administrador%20al%20panel%20de%20Mini%20Pig%20🐷"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 hover:scale-105"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" fill="#25D366" />
                <path fill="#FFFFFF" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.149-.198.297-.767.966-.94 1.165-.174.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.297.298-.496.1-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.205-.243-.58-.487-.502-.672-.512l-.573-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z" />
              </svg>
              Contactar Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

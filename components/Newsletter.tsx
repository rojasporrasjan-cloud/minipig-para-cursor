// components/Newsletter.tsx
'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '').trim();

    if (!email) {
      setStatus('Por favor escribe tu email.');
      return;
    }

    // Aquí podrías llamar a un endpoint /api/newsletter o Firestore
    setStatus(`¡Gracias! Te avisaremos a ${email} 🐷`);
    e.currentTarget.reset();
  }

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-light/20 via-brand-background/50 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(247,140,182,0.1),transparent)] opacity-60" />
      
      <div className="relative mx-auto max-w-4xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-12">
          {/* Elementos decorativos */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-brand-pink-light/40 to-brand-pink/30 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tl from-brand-pink/20 to-brand-pink-light/40 blur-2xl" />
          
          {/* Elementos flotantes */}
          <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-brand-pink/10 backdrop-blur-sm border border-brand-pink/20 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
            <span className="text-lg">💌</span>
          </div>
          
          <div className="absolute bottom-6 left-6 w-10 h-10 rounded-full bg-brand-pink-light/20 backdrop-blur-sm border border-brand-pink-light/30 flex items-center justify-center animate-bounce" style={{ animationDelay: '1.5s' }}>
            <span className="text-sm">📧</span>
          </div>

          <div className="relative text-center space-y-6">
            {/* Badge superior */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              Newsletter Mini Pig
            </div>

            {/* Título y descripción */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark">
                ¡Mantente al día con
                <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> nuestros consejos!</span>
              </h2>
              <p className="text-xl text-brand-text-muted max-w-2xl mx-auto leading-relaxed">
                Recibe guías de cuidado, novedades sobre mini pigs, ofertas exclusivas y mucho más directamente en tu email.
              </p>
            </div>

            {/* Formulario mejorado */}
            <form onSubmit={onSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="tu@email.com"
                  className="flex-1 rounded-2xl border-2 border-brand-border bg-white px-6 py-4 text-brand-dark placeholder:text-brand-text-muted focus:border-brand-pink focus:outline-none transition-colors text-center sm:text-left font-medium"
                />
                <button
                  type="submit"
                  className="group relative overflow-hidden rounded-2xl bg-brand-pink hover:bg-brand-pink-dark px-8 py-4 text-white font-bold transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Suscribirme
                    <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-pink-dark to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </form>

            {/* Estado del formulario */}
            {status && (
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-4 py-2 text-sm font-semibold animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
                {status}
              </div>
            )}

            {/* Beneficios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-brand-border/30">
              <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg">📚</span>
                </div>
                <span className="font-medium">Guías de cuidado</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-lg">🎁</span>
                </div>
                <span className="font-medium">Ofertas exclusivas</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">🚫</span>
                </div>
                <span className="font-medium">Sin spam</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

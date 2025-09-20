"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

type SiteSettings = {
  whatsappNumber: string;
  contactEmail: string;
  homepageHeroText: string;
};

export default function ConfiguracionAdminPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    whatsappNumber: '',
    contactEmail: '',
    homepageHeroText: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    try {
      const docRef = doc(db, 'settings', 'global');
      await setDoc(docRef, settings, { merge: true });
      setSuccess('¡Configuración guardada con éxito!');
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setIsSaving(false);
  };

  if (loading) return <p>Cargando configuración...</p>;

  return (
    <div className="space-y-8">
        {/* Header mejorado */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
            <span className="flex h-2 w-2 rounded-full bg-gray-400 animate-pulse"></span>
            Configuración del Sitio
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
              Configuración 
              <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Global</span>
            </h1>
            <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
          </div>
          <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
            Modifica datos clave que se usan en toda la página web
          </p>
        </header>

        {/* Mensaje de éxito */}
        {success && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="rounded-2xl bg-green-100 border border-green-200 text-green-800 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">✅</span>
              </div>
              <p className="font-semibold">{success}</p>
            </div>
          </div>
        )}

        {/* Formulario mejorado */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSave} className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-2xl p-8 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            <div className="space-y-2">
              <label htmlFor="whatsapp" className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-sm">📱</span>
                </div>
                Número de WhatsApp
              </label>
              <input
                id="whatsapp"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors"
                placeholder="Ej: 50612345678"
              />
              <p className="text-xs text-brand-text-muted">Este número se usará en todos los botones de contacto.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-sm">📧</span>
                </div>
                Email de Contacto
              </label>
              <input
                id="email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors"
                placeholder="tu@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="hero" className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-sm">📝</span>
                </div>
                Texto Principal (Página de Inicio)
              </label>
              <textarea
                id="hero"
                rows={4}
                value={settings.homepageHeroText}
                onChange={(e) => setSettings({ ...settings, homepageHeroText: e.target.value })}
                className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors resize-none"
                placeholder="Texto que aparecerá en la página principal..."
              />
            </div>

            <div className="pt-4 border-t border-brand-border">
              <button 
                type="submit" 
                disabled={isSaving} 
                className="w-full rounded-xl bg-brand-pink hover:bg-brand-pink-dark px-6 py-4 text-white font-bold transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Configuración
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
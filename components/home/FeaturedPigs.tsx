// components/home/FeaturedPigs.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Pig } from '@/lib/types/pig';
import PigCard from '@/components/PigCard';
import CardSkeleton from '@/components/CardSkeleton';

const WHATSAPP_NUMBER = "50672752645";

function waUrl(message: string, utm: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}&${utm}`;
}

export default function FeaturedPigs() {
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPigs = async () => {
      try {
        setError(null);
        const pigsRef = collection(db, 'pigs');
        // Los 3 más recientes, públicos y disponibles
        const q = query(
          pigsRef,
          where('visibility', '==', 'public'),
          where('status', '==', 'disponible'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const featuredPigs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pig));
        setPigs(featuredPigs);
      } catch (e) {
        console.error("Error al cargar los cerditos destacados:", e);
        setError("No pudimos cargar los cerditos destacados en este momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPigs();
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-background/20 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(247,140,182,0.08),transparent)] opacity-60" />
      
      <div className="relative mx-auto max-w-7xl px-4">
        {/* Encabezado mejorado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark mb-6">
            <span className="flex h-2 w-2 rounded-full bg-brand-pink animate-pulse"></span>
            Listos para adopción
          </div>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark text-center">
              Nuestros 
              <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> mini pigs</span>
              <span className="block text-3xl md:text-4xl mt-2 opacity-90">disponibles para adopción</span>
            </h2>
            <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
          </div>
          
          <p className="text-xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed mb-8">
            Cada uno de nuestros mini pigs ha sido criado con amor y está listo para encontrar su hogar definitivo contigo.
          </p>

          {/* Botón Ver todos desktop */}
          <Link
            href="/adopciones"
            className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-semibold transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95"
            aria-label="Ver todos los mini pigs disponibles"
            title="Ver todos los mini pigs"
          >
            Ver todos nuestros mini pigs
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid de mini pigs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <>
              <div className="animate-pulse">
                <div className="rounded-2xl bg-gray-200 aspect-[4/3] mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="animate-pulse">
                <div className="rounded-2xl bg-gray-200 aspect-[4/3] mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="animate-pulse">
                <div className="rounded-2xl bg-gray-200 aspect-[4/3] mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </>
          ) : error ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="text-center py-16 rounded-2xl bg-white/80 backdrop-blur-sm border border-brand-border shadow-lg">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">😔</span>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">Hubo un problema</h3>
                <p className="text-brand-text-muted mb-6 max-w-md mx-auto">{error}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    href="/adopciones" 
                    className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-semibold transition-all duration-300"
                  >
                    Intentar de nuevo
                  </Link>
                  <a
                    href={waUrl("Hola 👋, no puedo ver los cerditos destacados. ¿Me ayudan?", "utm_source=home&utm_medium=featured_error&utm_campaign=help")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 px-6 py-3 text-white font-semibold transition-all duration-300"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="12" fill="#25D366" />
                      <path fill="#FFFFFF" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.149-.198.297-.767.966-.94 1.165-.174.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.297.298-.496.1-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.205-.243-.58-.487-.502-.672-.512l-.573-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z" />
                    </svg>
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ) : pigs.length > 0 ? (
            pigs.map((pig, index) => (
              <div 
                key={pig.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PigCard pig={pig} />
              </div>
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="text-center py-16 rounded-2xl bg-white/80 backdrop-blur-sm border border-brand-border shadow-lg">
                <div className="w-16 h-16 rounded-full bg-brand-pink-light flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🐷</span>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">No hay mini pigs disponibles ahora</h3>
                <p className="text-brand-text-muted mb-6 max-w-md mx-auto">
                  ¡Vuelve a consultar pronto o escríbenos y te avisamos cuando tengamos nuevos mini pigs listos para adopción!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    href="/adopciones" 
                    className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-semibold transition-all duration-300"
                  >
                    Ver otros mini pigs
                  </Link>
                  <a
                    href={waUrl("Hola 👋, avísenme cuando haya mini pigs disponibles 🐷", "utm_source=home&utm_medium=featured_empty&utm_campaign=notify")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 px-6 py-3 text-white font-semibold transition-all duration-300"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="12" fill="#25D366" />
                      <path fill="#FFFFFF" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.149-.198.297-.767.966-.94 1.165-.174.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.297.298-.496.1-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.205-.243-.58-.487-.502-.672-.512l-.573-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z" />
                    </svg>
                    Recibir aviso por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats de adopción */}
        {pigs.length > 0 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-brand-pink">{pigs.length}</div>
              <div className="text-sm text-brand-text-muted font-medium">Disponibles ahora</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-brand-pink">100%</div>
              <div className="text-sm text-brand-text-muted font-medium">Salud garantizada</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-brand-pink">24h</div>
              <div className="text-sm text-brand-text-muted font-medium">Respuesta máxima</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-brand-pink">∞</div>
              <div className="text-sm text-brand-text-muted font-medium">Soporte post-adopción</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

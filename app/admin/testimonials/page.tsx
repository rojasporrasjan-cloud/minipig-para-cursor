// app/admin/testimonials/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Testimonial } from '@/lib/types/testimonial';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setTestimonials(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'approved' | 'pending') => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    const docRef = doc(db, 'testimonials', id);
    const promise = updateDoc(docRef, { status: newStatus });

    toast.promise(promise, {
      loading: 'Actualizando...',
      success: `Estado cambiado a ${newStatus}.`,
      error: 'No se pudo actualizar el estado.',
    });
  };

  if (loading) {
    return <p className="p-8">Cargando testimonios...</p>;
  }

  return (
    <div className="space-y-8">
        {/* Header mejorado */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
            <span className="flex h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
            Moderación de Historias
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
              Historias de 
              <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Clientes</span>
            </h1>
            <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
          </div>
          <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
            Revisa y aprueba las historias que aparecerán en el "Muro de Familias Felices"
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-lg text-white">❤️</span>
            </div>
            <div className="text-2xl font-black text-brand-pink">{testimonials.length}</div>
            <div className="text-sm text-brand-text-muted font-medium">Total Historias</div>
          </div>
          
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-lg text-white">✅</span>
            </div>
            <div className="text-2xl font-black text-brand-pink">
              {testimonials.filter(t => t.status === 'approved').length}
            </div>
            <div className="text-sm text-brand-text-muted font-medium">Aprobadas</div>
          </div>
          
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-lg text-white">⏳</span>
            </div>
            <div className="text-2xl font-black text-brand-pink">
              {testimonials.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-brand-text-muted font-medium">Pendientes</div>
          </div>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.length > 0 ? testimonials.map((t, index) => (
            <div 
              key={t.id} 
              className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Imagen */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4">
                <Image 
                  src={t.imageUrl} 
                  alt={`Historia de ${t.userName} y ${t.pigName}`} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Status badge */}
                <div className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold ${
                  t.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {t.status === 'approved' ? '✅ Aprobado' : '⏳ Pendiente'}
                </div>
              </div>
              
              {/* Contenido */}
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-lg text-brand-dark group-hover:text-brand-pink-dark transition-colors">
                    {t.userName} y {t.pigName}
                  </p>
                  <p className="text-sm text-brand-text-muted italic mt-2 line-clamp-3">
                    "{t.text}"
                  </p>
                </div>
                
                {/* Botón de acción */}
                <button
                  onClick={() => handleToggleStatus(t.id!, t.status as any)}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    t.status === 'approved'
                      ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                      : 'bg-green-100 hover:bg-green-200 text-green-800'
                  }`}
                >
                  {t.status === 'approved' ? '⏳ Marcar como Pendiente' : '✅ Aprobar Historia'}
                </button>
              </div>

              {/* Elementos decorativos */}
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-brand-pink opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="absolute bottom-4 right-4 w-1 h-1 rounded-full bg-brand-pink-dark opacity-30 group-hover:opacity-80 transition-opacity duration-300" />
            </div>
          )) : (
            <div className="col-span-full text-center py-16 rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">No hay historias aún</h3>
              <p className="text-brand-text-muted">
                Las historias compartidas por los clientes aparecerán aquí para moderación
              </p>
            </div>
          )}
        </div>
      </div>
  );
}
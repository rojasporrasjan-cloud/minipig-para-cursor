// app/familias-felices/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Testimonial } from '@/lib/types/testimonial';
import Image from 'next/image';
import Link from 'next/link';

// --- Skeleton para una carga más elegante ---
const TestimonialCardSkeleton = () => (
    <div className="card p-0 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-16 w-full rounded bg-gray-200" />
        <div className="h-5 w-1/2 ml-auto rounded bg-gray-200" />
      </div>
    </div>
);


// --- Tarjeta de Testimonio Rediseñada ---
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="card p-0 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col">
    <div className="relative aspect-[4/3] w-full">
      <Image
        src={testimonial.imageUrl}
        alt={`Foto de ${testimonial.pigName} con ${testimonial.userName}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <figure className="p-5 flex flex-col flex-grow">
      <blockquote className="italic text-brand-text-muted border-l-4 border-brand-pink-light pl-4 flex-grow">
        <p>"{testimonial.text}"</p>
      </blockquote>
      <figcaption className="mt-4 font-semibold text-brand-dark text-right">
        — {testimonial.userName} y {testimonial.pigName} 🐷
      </figcaption>
    </figure>
  </div>
);


// --- Página Principal de Testimonios Rediseñada ---
export default function FamiliasFelicesPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsRef = collection(db, 'testimonials');
        const q = query(
          testimonialsRef,
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const approvedTestimonials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        setTestimonials(approvedTestimonials);
      } catch (error) {
        console.error("Error al cargar los testimonios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <main>
      {/* Encabezado con fondo sutil */}
      <section className="bg-white/70 border-b border-brand-border">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <div className="text-5xl mb-4">❤️</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">
            Muro de Familias Felices
          </h1>
          <p className="mt-3 text-lg text-brand-text-muted max-w-2xl mx-auto">
            Historias reales de familias que han encontrado a su compañero ideal con nosotros.
          </p>
        </div>
      </section>

      {/* Galería de testimonios */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => <TestimonialCardSkeleton key={i} />)}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-xl bg-white/80 border border-brand-border">
            <span className="text-5xl">💌</span>
            <p className="mt-4 font-semibold text-xl text-brand-dark">Aún no hay historias para mostrar.</p>
            <p className="mt-2 text-brand-text-muted">¡Sé el primero en compartir tu experiencia!</p>
          </div>
        )}
      </section>
      
      {/* Llamado a la acción */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-gradient-to-r from-rose-100 to-pink-100 p-8 md:p-10 text-center">
           <h3 className="text-2xl md:text-3xl font-bold text-brand-dark">
            ¿Quieres empezar tu propia historia?
          </h3>
          <p className="mt-2 text-brand-text-muted max-w-2xl mx-auto">
            Descubre a los cerditos que están esperando un hogar lleno de amor.
          </p>
          <div className="mt-6">
            <Link href="/adopciones" className="btn-pig px-5 py-2.5 text-sm">
              Ver Cerditos Disponibles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
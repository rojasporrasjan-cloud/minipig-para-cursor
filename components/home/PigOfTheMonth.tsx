// components/home/PigOfTheMonth.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Pig } from '@/lib/types/pig';
import Image from 'next/image';
import Link from 'next/link';

// --- Componente Skeleton para una carga elegante ---
const PigOfTheMonthSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4 py-12 animate-pulse">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="aspect-square rounded-2xl bg-gray-200"></div>
      <div>
        <div className="h-6 w-1/3 rounded bg-gray-200"></div>
        <div className="mt-4 h-10 w-3/4 rounded bg-gray-200"></div>
        <div className="mt-4 h-20 w-full rounded bg-gray-200"></div>
        <div className="mt-6 h-12 w-1/2 rounded-full bg-gray-200"></div>
      </div>
    </div>
  </div>
);


export default function PigOfTheMonth() {
  const [pig, setPig] = useState<Pig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPigOfTheMonth = async () => {
      try {
        const pigsRef = collection(db, 'pigs');
        // Buscamos al único cerdito que tenga esta marca
        const q = query(
          pigsRef,
          where('isPigOfTheMonth', '==', true),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const pigData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Pig;
          setPig(pigData);
        }
      } catch (error) {
        console.error("Error al cargar el Cerdito del Mes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPigOfTheMonth();
  }, []);

  if (loading) {
    return <PigOfTheMonthSkeleton />;
  }

  // Si no se ha designado un Cerdito del Mes, no mostramos nada.
  if (!pig) {
    return null;
  }

  return (
    <section className="bg-brand-pink-light">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Columna de la Imagen */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
            <Image
              src={pig.images?.[0] || '/og-pig.jpg'}
              alt={`Foto de ${pig.name}, el cerdito del mes`}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority // Marcamos esta imagen como prioritaria para que cargue rápido
            />
            <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 font-bold text-sm px-3 py-1 rounded-full shadow-lg -rotate-6">
              ⭐ Cerdito del Mes
            </div>
          </div>

          {/* Columna de Texto */}
          <div className="text-center md:text-left">
            <p className="font-semibold text-brand-pink">Conoce a nuestro protagonista</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-brand-dark">{pig.name}</h2>
            <p className="mt-4 text-lg text-brand-text-muted">
              {pig.description || `Este mes, queremos presentarte a ${pig.name}, un cerdito con una personalidad única y mucho amor para dar. ¡Es el candidato perfecto para alegrar tu hogar!`}
            </p>
            <div className="mt-6">
              <Link href={`/adopciones/${pig.id}`} className="btn-primary">
                Conocer la historia de {pig.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
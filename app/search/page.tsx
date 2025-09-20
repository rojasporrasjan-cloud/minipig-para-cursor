// app/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, or } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Product } from '@/lib/types';
import { Pig } from '@/lib/types/pig';
import Link from 'next/link';
import CardSkeleton from '@/components/CardSkeleton';
import PigCard from '@/components/PigCard'; // Reutilizamos el PigCard

// Componente para mostrar un producto en los resultados
const ProductCard = ({ product }: { product: Product }) => (
  <Link href={`/tienda/${product.id}`} className="block group">
    <div className="card h-full flex flex-col transition-shadow duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="aspect-[4/3] grid place-items-center rounded-lg bg-gradient-to-tr from-rose-100 to-pink-100 text-6xl">
        <span aria-hidden>{product.category === 'Alimento' ? '🥣' : product.category === 'Higiene' ? '🧴' : '🧸'}</span>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-rose-950 group-hover:text-rose-600">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500 flex-grow">{product.short}</p>
        <span className="mt-4 block text-sm font-semibold text-rose-600">Ver producto →</span>
      </div>
    </div>
  </Link>
);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  
  const [results, setResults] = useState<(Product | Pig)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      
      try {
        // Firestore no soporta búsquedas de texto completo nativamente.
        // Esta es una simulación buscando coincidencias exactas en minúsculas.
        // Para una búsqueda profesional real, se usaría un servicio como Algolia.
        const searchTerm = q.toLowerCase();

        // Búsqueda en Productos
        const productsRef = collection(db, 'products');
        const productQuery = query(productsRef, 
            or(
                where('name_lowercase', '>=', searchTerm),
                where('name_lowercase', '<=', searchTerm + '\uf8ff')
            )
        );

        // Búsqueda en Cerditos
        const pigsRef = collection(db, 'pigs');
        const pigQuery = query(pigsRef,
            or(
                where('name_lowercase', '>=', searchTerm),
                where('name_lowercase', '<=', searchTerm + '\uf8ff')
            ),
            where('visibility', '==', 'public')
        );

        const [productSnap, pigSnap] = await Promise.all([
          getDocs(productQuery),
          getDocs(pigQuery)
        ]);

        const productResults = productSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'product' } as Product & { type: string }));
        const pigResults = pigSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'pig' } as Pig & { type: string }));
        
        setResults([...productResults, ...pigResults]);

      } catch (error) {
        console.error("Error en la búsqueda:", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [q]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Resultados de Búsqueda</h1>
        {q && <p className="text-lg text-[#6B625B] mt-1">Para: <span className="font-semibold text-rose-800">"{q}"</span></p>}
      </header>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {results.map(item => (
            (item as any).type === 'product'
              ? <ProductCard key={(item as Product).id} product={item as Product} />
              : <PigCard key={(item as Pig).id} pig={item as Pig} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-lg bg-white/80 border border-rose-200/60">
          <p className="text-lg font-semibold text-gray-700">No se encontraron resultados.</p>
          <p className="text-sm text-gray-500 mt-2">Intenta con otros términos de búsqueda.</p>
        </div>
      )}
    </main>
  );
}
// app/adopciones/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { db } from '@/lib/firebase/client';
import { Pig } from '@/lib/types/pig';
import { Sale } from '@/lib/types/sale'; // <-- Importamos el tipo Sale
import Link from 'next/link';
import ExpedienteDigital from './ExpedienteDigital';
import PigDetailClient from './PigDetailClient';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';

export default function AdopcionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pig, setPig] = useState<Pig | null>(null);
  const [sale, setSale] = useState<Sale | null>(null); // <-- Nuevo estado para la venta
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchPigAndSaleData = async () => {
      try {
        // Obtenemos los datos del cerdito usando Firebase v9
        const pigDocRef = doc(db, 'pigs', id);
        const pigDoc = await getDoc(pigDocRef);
        
        if (!pigDoc.exists()) {
          throw new Error('No se pudo encontrar a este cerdito.');
        }
        
        const data = pigDoc.data() as Omit<Pig, 'id'>;
        const clientPig = {
          id: pigDoc.id, ...data,
          birthDate: data.birthDate ? (data.birthDate as any).toDate() : null,
          createdAt: data.createdAt ? (data.createdAt as any).toDate() : null,
          updatedAt: data.updatedAt ? (data.updatedAt as any).toDate() : null,
          milestones: (data.milestones || []).map((m: any) => ({ ...m, date: m.date?.toDate ? m.date.toDate() : new Date(m.date) })),
        };
        setPig(clientPig as Pig);

        // Si el cerdito está vendido, buscamos la venta asociada
        if (clientPig.status === 'vendido') {
          const salesRef = collection(db, 'sales');
          const q = query(salesRef, where('pigId', '==', id), limit(1));
          const saleSnap = await getDocs(q);

          if (!saleSnap.empty) {
            const saleData = saleSnap.docs[0].data() as Omit<Sale, 'id'>;
            const saleWithDates = {
              ...saleData,
              saleDate: saleData.saleDate ? (saleData.saleDate as any).toDate() : null,
              createdAt: saleData.createdAt ? (saleData.createdAt as any).toDate() : null,
              updatedAt: saleData.updatedAt ? (saleData.updatedAt as any).toDate() : null,
            };
            setSale({ id: saleSnap.docs[0].id, ...saleWithDates });
          }
        }

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPigAndSaleData();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 text-center">
        <p className="text-gray-500 animate-pulse">Cargando información...</p>
      </main>
    );
  }

  if (error || !pig) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <Link href="/adopciones" className="text-sm font-medium text-brand-pink hover:underline">
          ← Volver a Adopciones
        </Link>
      </div>

      {/* La lógica ahora también depende de si encontramos la venta */}
      {pig.status === 'vendido' && sale ? (
        <ExpedienteDigital pig={pig} sale={sale} />
      ) : (
        <PigDetailClient pig={pig} />
      )}
    </main>
  );
}
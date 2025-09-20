// app/mi-cuenta/diario/[pigId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getPigById } from '@/lib/firebase/pigs';
import { Pig } from '@/lib/types/pig';
import PigDiaryDashboard from '@/components/diary/PigDiaryDashboard';
import BackButton from '@/components/BackButton';

export default function PigDiaryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUserProfile();
  const [pig, setPig] = useState<Pig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pigId = params.pigId as string;

  useEffect(() => {
    const loadPig = async () => {
      if (!pigId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const pigData = await getPigById(pigId);
        
        if (!pigData) {
          setError('Cerdito no encontrado');
          return;
        }

        // Verificar que el usuario sea el dueño
        if (pigData.ownerId !== user?.uid) {
          setError('No tienes permisos para ver este diario');
          return;
        }

        setPig(pigData);
      } catch (err) {
        console.error('Error loading pig:', err);
        setError('Error al cargar el cerdito');
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user) {
      loadPig();
    }
  }, [pigId, user, userLoading]);

  // Redirección si no hay sesión
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  if (userLoading || loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <BackButton href="/mi-cuenta" />
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <button
            onClick={() => router.push('/mi-cuenta')}
            className="btn-pig"
          >
            Volver a Mi Cuenta
          </button>
        </div>
      </main>
    );
  }

  if (!pig) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <BackButton href="/mi-cuenta" />
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐷</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cargando diario...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <BackButton href="/mi-cuenta" />
      <PigDiaryDashboard pig={pig} />
    </main>
  );
}

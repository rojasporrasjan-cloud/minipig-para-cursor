// app/(account)/mi-cuenta/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { useUserProfile } from '@/hooks/useUserProfile';
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProducts';

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

import type { Pig, Sale, Product } from '@/lib/types';
import ShareStoryModal from '@/components/account/ShareStoryModal';
import { formatCRC } from '@/lib/format';

/* ================== Iconos inline ================== */
const ChevronRight = () => (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);
const HeartIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.1 21.35l-.1.1-.11-.1C7.14 17.24 4 14.39 4 11.28 4 9 5.79 7.2 8.05 7.2c1.22 0 2.4.56 3.15 1.44a4.23 4.23 0 013.15-1.44C18.21 7.2 20 9 20 11.28c0 3.11-3.14 5.96-7.9 10.07z"/>
  </svg>
);

/* ================== Subcomponentes UI ================== */

/** Card de expediente en Mi Cuenta (SIN badges de estado/sexo/edad) */
function OwnedPigCard({ pig }: { pig: Pig & { id: string } }) {
  const imageUrl = pig.images?.[0] || '/og-pig.jpg';
  return (
    <div className="group relative block overflow-hidden rounded-xl">
      <Link
        href={`/adopciones/${pig.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver expediente de ${pig.name}`}
        title={`Ver expediente de ${pig.name}`}
      />
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={`Foto de ${pig.name}`}
          fill
          sizes="300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Overlay degradado (sin badges arriba) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="font-bold text-lg text-white drop-shadow-md">{pig.name}</h3>
        <div className="flex space-x-2 mt-2">
          <span className="inline-block text-xs font-semibold text-black bg-white/80 px-2 py-1 rounded-full">
            Ver Expediente →
          </span>
        </div>
      </div>

      {/* Botón del diario */}
      <div className="absolute top-2 right-2 z-20">
        <Link
          href={`/mi-cuenta/diario/${pig.id}`}
          className="inline-flex items-center px-3 py-1.5 bg-brand-pink text-white text-xs font-semibold rounded-full hover:bg-brand-pink-dark transition-colors shadow-lg"
          title={`Ver diario de vida de ${pig.name}`}
        >
          📔 Diario
        </Link>
      </div>
    </div>
  );
}

/** Card de producto favorito (pequeña) */
function FavoriteProductCard({ product }: { product: Product }) {
  const emoji = product.category === 'Alimento' ? '🥣' : '🧸';
  return (
    <Link href={`/tienda/${product.id}`} className="group" aria-label={`Ver producto ${product.name}`} title={product.name}>
      <div className="card h-full p-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative aspect-square w-full rounded-lg bg-gradient-to-tr from-rose-100 to-pink-100 text-4xl grid place-items-center">
          <span aria-hidden>{emoji}</span>
        </div>
        <h4 className="mt-2 text-xs text-center font-semibold text-brand-dark group-hover:text-brand-pink">
          {product.name}
        </h4>
      </div>
    </Link>
  );
}

/** Cupón con copiar código y CTA usar ahora */
function CouponDisplay({ coupon }: { coupon: Sale['welcomeCoupon'] }) {
  const code = coupon?.code || '—';
  const discount = coupon?.discount ?? 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('¡Código copiado!');
    } catch {
      toast('Copia el código: ' + code);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-300 to-amber-400 p-4 text-center text-amber-900 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-wider">Tu Regalo de Bienvenida</p>
      <p className="font-mono text-2xl font-black my-1">{code}</p>
      <p className="text-sm font-semibold">{discount}% de Descuento</p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <button onClick={copy} className="inline-flex items-center rounded-full bg-amber-900/10 px-3 py-1.5 text-xs font-semibold hover:bg-amber-900/15">
          Copiar código
        </button>
        <Link href="/tienda" className="inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-white">
          Usar ahora <ChevronRight />
        </Link>
      </div>
    </div>
  );
}

function SkeletonLine({ w = 'w-1/2', h = 'h-5' }: { w?: string; h?: string }) {
  return <div className={`${h} ${w} rounded bg-gray-200 animate-pulse`} />;
}
function SkeletonCard() {
  return <div className="card h-28 animate-pulse bg-gray-200" />;
}

/* ================== Helpers ================== */
function computeProfileCompletion(user: any, userProfile: any) {
  const fields = [
    Boolean(userProfile?.displayName || user?.displayName),
    Boolean(user?.email),
    Boolean(user?.photoURL || userProfile?.avatarUrl || userProfile?.avatar || userProfile?.avatarId),
    Boolean(userProfile?.phone || user?.phoneNumber),
    Boolean(userProfile?.address),
  ];
  const total = fields.length;
  const completed = fields.filter(Boolean).length;
  const percent = Math.round((completed / total) * 100);
  return { completed, total, percent };
}

/* ================== Página ================== */
export default function MyAccountPage() {
  const router = useRouter();
  const { user, userProfile, loading: userLoading } = useUserProfile();

  const [ownedPigs, setOwnedPigs] = useState<(Pig & { id: string })[]>([]);
  const [activeCoupons, setActiveCoupons] = useState<Sale[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { favorites } = useFavorites();
  const { items: allProducts } = useProducts();
  const favoriteProducts = useMemo(
    () => allProducts.filter((p) => favorites.includes(p.id)).slice(0, 8),
    [allProducts, favorites]
  );

  const [isShareStoryModalOpen, setIsShareStoryModalOpen] = useState(false);

  // Redirección si no hay sesión
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  // Cargar datos paralelamente
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoadingData(true);
      setErrorMsg(null);

      try {
        const pigsRef = collection(db, 'pigs');
        const pigsQuery = query(pigsRef, where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'));

        const salesRef = collection(db, 'sales');
        const couponsQuery = query(
          salesRef,
          where('customerId', '==', user.uid),
          where('welcomeCoupon.status', '==', 'active')
        );

        const [pigsSnapshot, couponsSnapshot] = await Promise.all([getDocs(pigsQuery), getDocs(couponsQuery)]);

        const pigsData = pigsSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })) as (Pig & { id: string })[];
        const couponsData = couponsSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })) as Sale[];

        setOwnedPigs(pigsData);
        setActiveCoupons(couponsData);
      } catch (err) {
        console.error('Error al cargar los datos de la cuenta:', err);
        setErrorMsg('No pudimos cargar toda tu información. Intenta nuevamente.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  // Loading
  if (userLoading || loadingData) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <SkeletonLine w="w-1/3" h="h-7" />
          <div className="mt-2 flex gap-3">
            <SkeletonLine w="w-1/5" />
            <SkeletonLine w="w-24" />
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
    );
  }

  // Si por alguna razón no hay user (ya debería haber redirigido)
  if (!user) return null;

  const lastLogin = (() => {
    const t = (user as any)?.metadata?.lastSignInTime;
    if (!t) return null;
    try {
      return new Date(t).toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return t;
    }
  })();

  const completion = computeProfileCompletion(user, userProfile);

  return (
    <>
      <main className="relative min-h-screen">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-light/20 via-brand-background to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(247,140,182,0.08),transparent)] opacity-60" />
        
          <div className="relative mx-auto max-w-7xl px-4 py-12">
          {/* Header mejorado */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              Panel Personal
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-brand-dark">
                ¡Hola, 
                <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent">
                  {userProfile?.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>!
              </h1>
              <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
                Bienvenido a tu panel personal donde puedes gestionar tus mini pigs, favoritos y perfil.
                {lastLogin && (
                  <span className="block mt-2 text-sm opacity-75">
                    Último acceso: {lastLogin}
                  </span>
                )}
              </p>
            </div>

            {/* Progreso del perfil mejorado */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-brand-dark">Perfil completo</h3>
                  <span className="text-2xl font-black text-brand-pink">{completion.percent}%</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-brand-pink-light/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-pink to-brand-pink-dark transition-all duration-700"
                    style={{ width: `${completion.percent}%` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
                <p className="text-xs text-brand-text-muted mt-3 text-center">
                  {completion.percent === 100 
                    ? "¡Perfil completo! 🎉" 
                    : `${5 - completion.completed} campos por completar`
                  }
                </p>
              </div>
            </div>
          </header>

        {/* Mensaje de error (si hubo fallo en Firestore) */}
        {errorMsg && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800" role="alert" aria-live="polite">
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Acciones rápidas mejoradas */}
        <section className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/configuracion" 
              className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border hover:border-brand-pink px-6 py-3 text-brand-dark hover:text-brand-pink-dark font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Editar perfil
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-pink-light/0 to-brand-pink-light/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <a
              href={`https://wa.me/50672752645?text=${encodeURIComponent('Hola, necesito ayuda con mi cuenta en Yo Tengo un Mini Pig 🐷')}&utm_source=my_account&utm_medium=whatsapp&utm_campaign=account_support`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-green-600 hover:bg-green-700 px-6 py-3 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              title="Soporte por WhatsApp"
            >
              <span className="relative z-10 flex items-center gap-2">
                <HeartIcon />
                Soporte 24/7
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            <Link 
              href="/tienda" 
              className="group relative overflow-hidden rounded-2xl bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-bold transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Ir a tienda
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-pink-dark to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Mis expedientes mejorados */}
            <section className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-pink to-brand-pink-dark flex items-center justify-center">
                  <span className="text-lg text-white">🐷</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-brand-dark">Mis Mini Pigs</h2>
                  <p className="text-brand-text-muted">Tus compañeros adoptados</p>
                </div>
                <Link 
                  href="/adopciones" 
                  className="inline-flex items-center gap-1 text-brand-pink hover:text-brand-pink-dark font-semibold text-sm transition-colors"
                >
                  Ver todos
                  <ChevronRight />
                </Link>
              </div>

              {ownedPigs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {ownedPigs.map((pig, index) => (
                    <div 
                      key={pig.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <OwnedPigCard pig={pig} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg">
                  <div className="w-20 h-20 rounded-full bg-brand-pink-light flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🐷</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">¡Tu primer mini pig te espera!</h3>
                  <p className="text-brand-text-muted mb-8 max-w-md mx-auto">
                    Aún no has adoptado ningún mini pig. Explora nuestros adorables compañeros disponibles.
                  </p>
                  <Link 
                    href="/adopciones" 
                    className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-8 py-4 text-white font-bold transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Explorar Mini Pigs
                  </Link>
                </div>
              )}
            </section>

            {/* Compartir historia mejorada */}
            {ownedPigs.length > 0 && (
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 border border-pink-200 p-8 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {/* Elementos decorativos */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-pink-200/50 backdrop-blur-sm flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <span className="text-2xl">💕</span>
                </div>
                
                <div className="relative space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center mx-auto">
                    <span className="text-2xl text-white">❤️</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-dark">¿Feliz con tu mini pig?</h3>
                    <p className="text-brand-text-muted mt-2 max-w-md mx-auto">
                      ¡Ayuda a otros a decidirse! Comparte una foto y tu experiencia con la comunidad.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsShareStoryModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-8 py-4 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Compartir mi Historia
                  </button>
                </div>
              </section>
            )}

            {/* Favoritos mejorados */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                  <span className="text-lg text-white">❤️</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-brand-dark">Mis Favoritos</h2>
                  <p className="text-brand-text-muted">Productos que te gustan</p>
                </div>
                <Link 
                  href="/favoritos" 
                  className="inline-flex items-center gap-1 text-brand-pink hover:text-brand-pink-dark font-semibold text-sm transition-colors"
                >
                  Ver todos
                  <ChevronRight />
                </Link>
              </div>

              {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {favoriteProducts.map((product, index) => (
                    <div 
                      key={product.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <FavoriteProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💔</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark mb-2">No tienes favoritos aún</h3>
                  <p className="text-brand-text-muted mb-6">
                    Explora nuestra tienda y marca tus productos favoritos
                  </p>
                  <Link 
                    href="/tienda" 
                    className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Explorar Tienda
                    <ChevronRight />
                  </Link>
                </div>
              )}
            </section>

            {/* Guías y recursos mejoradas */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-lg text-white">📚</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-brand-dark">Guías y Recursos</h2>
                  <p className="text-brand-text-muted">Todo lo que necesitas saber</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <a
                  href="/docs/guia-cuidados-minipig.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                      📄
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-dark group-hover:text-brand-pink-dark transition-colors">
                        Guía de cuidados (PDF)
                      </h3>
                      <p className="text-sm text-brand-text-muted mt-1">
                        Alimentación, espacio, higiene y tips esenciales
                      </p>
                    </div>
                    <ChevronRight />
                  </div>
                </a>

                <Link 
                  href="/faq" 
                  className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
                      ❓
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-dark group-hover:text-brand-pink-dark transition-colors">
                        Preguntas frecuentes
                      </h3>
                      <p className="text-sm text-brand-text-muted mt-1">
                        Resuelve dudas comunes antes y después de adoptar
                      </p>
                    </div>
                    <ChevronRight />
                  </div>
                </Link>

                <a
                  href={`https://wa.me/50672752645?text=${encodeURIComponent('Hola, ¿me comparten tips para el cuidado de mi mini pig? 🐷')}&utm_source=my_account&utm_medium=whatsapp&utm_campaign=care_tips`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
                      💬
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-dark group-hover:text-brand-pink-dark transition-colors">
                        Tips por WhatsApp
                      </h3>
                      <p className="text-sm text-brand-text-muted mt-1">
                        Te enviamos recomendaciones personalizadas
                      </p>
                    </div>
                    <ChevronRight />
                  </div>
                </a>

                <Link 
                  href="/blog" 
                  className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                      📖
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-dark group-hover:text-brand-pink-dark transition-colors">
                        Aprende en el blog
                      </h3>
                      <p className="text-sm text-brand-text-muted mt-1">
                        Consejos de convivencia, salud y entrenamiento
                      </p>
                    </div>
                    <ChevronRight />
                  </div>
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar mejorado */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Mi Perfil */}
            <section className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-brand-dark">Mi Perfil</h3>
              </div>
              <p className="text-sm text-brand-text-muted mb-6">
                Administra tus datos personales, avatar y preferencias de la cuenta.
              </p>
              <Link 
                href="/configuracion" 
                className="block w-full text-center rounded-xl bg-brand-pink hover:bg-brand-pink-dark px-4 py-3 text-white font-semibold transition-all duration-300 hover:scale-105"
              >
                Editar Perfil y Avatar
              </Link>
            </section>

            {/* Mis Cupones */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <span className="text-lg text-white">🎫</span>
                </div>
                <h3 className="text-lg font-bold text-brand-dark">Mis Cupones</h3>
              </div>
              
              {activeCoupons.length > 0 ? (
                <div className="space-y-4">
                  {activeCoupons.map((sale, index) => (
                    <div 
                      key={sale.id as string}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                    >
                      <CouponDisplay coupon={sale.welcomeCoupon} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg">🎫</span>
                  </div>
                  <p className="text-sm text-brand-text-muted">No tienes cupones activos</p>
                </div>
              )}
            </section>

            {/* Resumen mejorado */}
            {ownedPigs.length > 0 && (
              <section className="rounded-2xl bg-gradient-to-br from-brand-pink-light/30 to-brand-pink/20 border border-brand-pink-light p-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-pink to-brand-pink-dark flex items-center justify-center">
                    <span className="text-lg text-white">📊</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark">Mi Resumen</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-brand-pink-light/50">
                    <span className="text-sm text-brand-text-muted">Mini pigs adoptados</span>
                    <span className="font-bold text-brand-dark">{ownedPigs.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-brand-pink-light/50">
                    <span className="text-sm text-brand-text-muted">Productos favoritos</span>
                    <span className="font-bold text-brand-dark">{favoriteProducts.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-brand-pink-light/50">
                    <span className="text-sm text-brand-text-muted">Cupones activos</span>
                    <span className="font-bold text-brand-dark">{activeCoupons.length}</span>
                  </div>

                  {/* Si quieres mostrar inversión aproximada */}
                  {ownedPigs.every(p => typeof (p as any).priceCRC === 'number') && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-brand-text-muted">Inversión total</span>
                      <span className="font-black text-brand-pink text-lg font-mono">
                        {formatCRC(ownedPigs.reduce((acc, p) => acc + ((p as any).priceCRC || 0), 0))}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </aside>
        </div>
        </div>
      </main>

      {/* Modal para compartir historia */}
      <ShareStoryModal
        isOpen={isShareStoryModalOpen}
        onClose={() => setIsShareStoryModalOpen(false)}
        pigs={ownedPigs}
      />
    </>
  );
}

// app/tienda/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { formatCRC } from '@/lib/format';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

const WHATSAPP_NUMBER = '50672752645';
const wa = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-all ${filled ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-400'}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { add } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No se proporcionó un ID de producto.");
      return;
    }

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setError("Producto no encontrado.");
        }
      } catch (err) {
        console.error("Error fetching product on client:", err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  
  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-center py-20">Cargando producto...</div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-xl border border-rose-200/60 bg-white/80 p-6 text-center">
          <h1 className="text-xl font-semibold text-rose-950">{error || "Producto no encontrado"}</h1>
          <p className="mt-2 text-[#5B524C]">Puede haber sido retirado o el enlace es incorrecto.</p>
          <div className="mt-4">
            <Link href="/tienda" className="text-sm underline text-rose-900">Volver a la tienda</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="rounded-xl border border-rose-200/60 bg-gradient-to-tr from-rose-100 to-pink-100 h-96 grid place-items-center text-8xl">
          <span aria-hidden>{product.category === 'Alimento' ? '🥣' : product.category === 'Higiene' ? '🧴' : product.category === 'Accesorios' ? '🧸' : '🛏️'}</span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-rose-950">{product.name}</h1>
          <p className="mt-3 text-lg text-[#5B524C]">{product.short}</p>
          <div className="mt-5 flex items-center gap-4">
            <span className="text-rose-900 font-extrabold text-3xl">{formatCRC(product.priceCRC)}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.inStock ? 'En stock' : 'Agotado'}
            </span>
            {product.tag && <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">{product.tag}</span>}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              disabled={!product.inStock}
              onClick={() => add({ id: product.id, name: product.name, priceCRC: product.priceCRC }, 1)}
              className="btn-primary flex-1 py-3"
            >
              Añadir al carrito
            </button>
            <button
              onClick={() => toggleFavorite(product.id, product.name)}
              className="btn-ghost group flex items-center justify-center gap-2 border border-rose-300 px-4 py-3"
              aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <HeartIcon filled={isFavorite(product.id)} />
            </button>
            <a
              href={wa(`Hola 👋, me interesa el producto: ${product.name} (${formatCRC(product.priceCRC)}). ID: ${product.id}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost border border-rose-300 px-4 py-3"
            >
              Consultar por WhatsApp
            </a>
          </div>
          <div className="mt-10 border-t pt-6">
            <h2 className="text-base font-semibold text-rose-950">Detalles del Producto</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-[#5B524C]">
              <li>Categoría: {product.category}</li>
              {product.stock && <li>{product.stock < 5 ? `¡Solo quedan ${product.stock} unidades!` : `Unidades disponibles: ${product.stock}`}</li>}
              <li>Entrega coordinada directamente por WhatsApp.</li>
              <li>Asesoría post-compra incluida.</li>
            </ul>
          </div>
           <div className="mt-8">
            <Link href="/tienda" className="text-sm font-medium text-rose-700 hover:underline">
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
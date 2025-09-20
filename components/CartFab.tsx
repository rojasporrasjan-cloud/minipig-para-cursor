// components/CartFab.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartFab() {
  const { count } = useCart();

  return (
    <Link
      href="/tienda/cart"
      aria-label="Abrir carrito"
      className="fixed bottom-20 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-dark text-white shadow-lg hover:bg-opacity-80 transition-all hover:scale-110"
      title="Carrito de Compras"
    >
      {/* --- NUEVO ICONO DE CARRITO DE COMPRAS --- */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm1.336-5l1.977-7h-16.813l2.938 7h11.898zm4.969-10l-3.432 12h-12.597l.839 2h13.239l3.474-12h-1.522z"/>
      </svg>
      
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-6 h-6 rounded-full bg-brand-pink text-[11px] px-1 flex items-center justify-center font-bold ring-2 ring-white">
          {count}
        </span>
      )}
    </Link>
  );
}
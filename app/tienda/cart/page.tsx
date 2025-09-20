'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatCRC } from '@/lib/format';
import { useMemo, useState } from 'react';

const WHATSAPP_NUMBER = '50672752645';

export default function CartPage() {
  const { 
    items, subtotal, discountAmount, totalCRC, coupon,
    setQty, remove, clear, applyCoupon, isVerifyingCoupon, couponError 
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');

  const message = useMemo(() => {
    const lines = [
      '🛒 Pedido desde la Tienda Mini Pig', '',
      ...items.map(it => `• ${it.name} x${it.qty} — Subtotal: ${formatCRC(it.priceCRC * it.qty)}`),
      '', `Subtotal: ${formatCRC(subtotal)}`,
    ];
    if (coupon) {
      lines.push(`Descuento (${coupon.discount}%): -${formatCRC(discountAmount)}`);
      lines.push(`Código Usado: ${coupon.code}`);
    }
    lines.push(`TOTAL FINAL: ${formatCRC(totalCRC)}`);
    return lines.join('\n');
  }, [items, subtotal, discountAmount, totalCRC, coupon]);

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">Carrito de Compras</h1>
      
      {items.length === 0 ? (
        <div className="mt-8 text-center py-20 rounded-lg bg-white/80 border border-brand-border">
          <span className="text-6xl">🛒</span>
          <p className="mt-4 font-semibold text-xl">Tu carrito está vacío.</p>
          <p className="mt-2 text-brand-text-muted">Parece que aún no has añadido ningún producto.</p>
          <Link href="/tienda" className="mt-6 inline-block btn-primary">Ir a la Tienda</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Columna Izquierda: Lista de Productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.id} className="card p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-shrink-0 h-24 w-24 rounded-lg bg-gradient-to-tr from-rose-100 to-pink-100 text-4xl grid place-items-center">
                  <span>{it.name.includes('Alimento') ? '🥣' : '🧸'}</span>
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <p className="font-bold text-brand-dark">{it.name}</p>
                  <p className="text-sm text-brand-text-muted">{formatCRC(it.priceCRC)} c/u</p>
                  <button onClick={() => remove(it.id)} className="mt-1 text-xs text-red-500 hover:underline">Quitar</button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-brand-border rounded-full">
                    <button onClick={() => setQty(it.id, it.qty - 1)} className="px-3 py-1 text-lg font-bold text-brand-text-muted">-</button>
                    <span className="px-4 text-sm font-semibold">{it.qty}</span>
                    <button onClick={() => setQty(it.id, it.qty + 1)} className="px-3 py-1 text-lg font-bold text-brand-text-muted">+</button>
                  </div>
                </div>
                <div className="sm:text-right font-semibold text-lg w-24">
                  {formatCRC(it.priceCRC * it.qty)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Columna Derecha: Resumen del Pedido */}
          <div className="lg:col-span-1 card p-6 space-y-4 sticky top-24">
            <h2 className="text-xl font-bold">Resumen del Pedido</h2>
            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCRC(subtotal)}</span></div>
              {coupon && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Descuento ({coupon.discount}%)</span>
                  <span>-{formatCRC(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatCRC(totalCRC)}</span></div>
            </div>
            <div className="border-t pt-4">
              <label className="block text-sm font-medium mb-1">¿Tienes un cupón?</label>
              <div className="flex gap-2">
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="CÓDIGO..." className="input-style flex-grow" disabled={!!coupon}/>
                <button onClick={() => applyCoupon(couponCode)} disabled={isVerifyingCoupon || !!coupon} className="btn-secondary !px-4 !py-2 !text-xs">{isVerifyingCoupon ? '...' : 'Aplicar'}</button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
            </div>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center">
              Completar Pedido por WhatsApp
            </a>
            <button onClick={clear} className="w-full text-center text-xs text-gray-500 hover:underline mt-2">Vaciar carrito</button>
          </div>
        </div>
      )}
    </main>
  );
}
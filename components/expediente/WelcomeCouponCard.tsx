// components/expediente/WelcomeCouponCard.tsx
'use client';

import { Sale } from '@/lib/types/sale';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Icono para el botón de copiar
const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

// Icono de check para confirmar que se copió
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


export default function WelcomeCouponCard({ sale }: { sale: Sale }) {
  const [copied, setCopied] = useState(false);
  const coupon = sale.welcomeCoupon;

  if (!coupon || coupon.status !== 'active') {
    return null; // No mostramos nada si no hay cupón activo
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success('¡Código copiado al portapapeles!');
    setTimeout(() => setCopied(false), 2000); // Resetear el ícono después de 2 segundos
  };

  return (
    <div className="card p-6 bg-gradient-to-tr from-yellow-50 via-amber-100 to-yellow-200 border-amber-300 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-shrink-0 text-5xl">🎁</div>
        <div className="flex-grow text-center md:text-left">
          <h3 className="text-xl font-bold text-amber-900">¡Un Regalo de Bienvenida!</h3>
          <p className="text-sm text-amber-800 mt-1">
            Como agradecimiento por darle un hogar a {sale.pigName}, te regalamos un descuento especial para tu próxima compra en nuestra tienda.
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto">
          <div className="bg-white border-2 border-dashed border-amber-400 rounded-lg p-3 text-center">
            <p className="text-xs text-amber-700">Tu código de un solo uso:</p>
            <p className="font-mono text-2xl font-bold text-amber-800 my-1">{coupon.code}</p>
            <button
              onClick={handleCopy}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-amber-400 text-amber-900 font-bold text-sm px-4 py-2 rounded-md hover:bg-amber-500 transition-colors"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? '¡Copiado!' : 'Copiar Código'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
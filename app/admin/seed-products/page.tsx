// app/admin/seed-products/page.tsx
'use client';

import { upsertProduct } from '@/lib/firestore/products';
import { Product } from '@/lib/types';
import { useState } from 'react';

const demo: Omit<Product, 'createdAt'|'updatedAt'>[] = [
  { id: 'food-premium',  name: 'Pellets premium 5kg', priceCRC: 22900, category: 'Alimento',  tag: 'Top ventas', short: 'Nutrición balanceada para mini pigs.', inStock: true,  featured: true },
  { id: 'bowl',          name: 'Plato antideslizante', priceCRC: 7900,  category: 'Accesorios', tag: 'Nuevo',      short: 'Estable y fácil de limpiar.',     inStock: true,  featured: false },
  { id: 'harness-m',     name: 'Arnés + correa (M)',   priceCRC: 12500, category: 'Accesorios', tag: 'Popular',    short: 'Paseos seguros y cómodos.',       inStock: true,  featured: true },
  { id: 'bed-ortho',     name: 'Cama ortopédica',      priceCRC: 29900, category: 'Camas',      tag: 'Confort',    short: 'Soporte y descanso profundo.',     inStock: true,  featured: false },
  { id: 'shampoo-soft',  name: 'Shampoo suave 250ml',  priceCRC: 6900,  category: 'Higiene',                      short: 'Limpieza delicada y brillo natural.', inStock: true, featured: false },
  { id: 'toalla-secado', name: 'Toalla de secado rápido', priceCRC: 5400, category: 'Higiene',                  short: 'Suave y ultra absorbente.',         inStock: true,  featured: false },
  { id: 'juguete-mordida', name: 'Juguete de mordida', priceCRC: 3800,  category: 'Accesorios',                 short: 'Entretenimiento y estimulación.',   inStock: false, featured: false },
  { id: 'mantita-invierno', name: 'Mantita invierno',  priceCRC: 9900,  category: 'Camas',                      short: 'Abrigo y confort para dormir.',     inStock: true,  featured: false },
];

export default function SeedProductsPage() {
  const [status, setStatus] = useState<string>('');

  async function seed() {
    try {
      setStatus('Cargando productos demo…');
      for (const p of demo) {
        await upsertProduct(p);
      }
      setStatus('✅ Productos demo cargados. Abre /tienda para verlos.');
    } catch (e: any) {
      setStatus('❌ Error: ' + (e?.message ?? 'desconocido'));
    }
  }

  return (
    <main className="space-y-8">
      {/* Header mejorado */}
      <header className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
          <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse"></span>
          Herramientas de Desarrollo
        </div>
        <div className="flex items-center justify-center gap-8">
          <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
          <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
            Seed de 
            <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Productos</span>
          </h1>
          <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
        </div>
        <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
          Herramienta para cargar productos de ejemplo en la base de datos
        </p>
      </header>

      {/* Contenido */}
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-2xl p-8 text-center space-y-6 animate-fade-in-up">
          
          {/* Icono */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto">
            <span className="text-3xl text-white">🛍️</span>
          </div>

          {/* Información */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-dark">Cargar Productos Demo</h2>
            <div className="text-brand-text-muted space-y-2">
              <p>Este proceso creará {demo.length} productos de ejemplo en tu tienda.</p>
              <p className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <strong>⚠️ Importante:</strong> Asegúrate de estar logueado como admin/owner y tener las reglas de Firestore configuradas correctamente.
              </p>
            </div>
          </div>

          {/* Botón de acción */}
          <button
            onClick={seed}
            className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-8 py-4 text-white font-bold transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Cargar Productos Demo
          </button>

          {/* Estado */}
          {status && (
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold animate-fade-in-up ${
              status.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : status.includes('❌')
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {status.includes('✅') && <span className="w-2 h-2 rounded-full bg-green-500" />}
              {status.includes('❌') && <span className="w-2 h-2 rounded-full bg-red-500" />}
              {!status.includes('✅') && !status.includes('❌') && <div className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full animate-spin" />}
              {status}
            </div>
          )}

          {/* Lista de productos que se van a crear */}
          <details className="text-left">
            <summary className="cursor-pointer text-brand-pink hover:text-brand-pink-dark font-semibold">
              Ver productos que se crearán ({demo.length})
            </summary>
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {demo.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg bg-brand-background/50">
                  <span className="text-lg">
                    {product.category === 'Alimento' ? '🥣' : 
                     product.category === 'Higiene' ? '🧴' : 
                     product.category === 'Accesorios' ? '🧸' : '🛏️'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-dark">{product.name}</p>
                    <p className="text-xs text-brand-text-muted">{product.category}</p>
                  </div>
                  <span className="text-sm font-mono text-brand-pink">₡{product.priceCRC.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}

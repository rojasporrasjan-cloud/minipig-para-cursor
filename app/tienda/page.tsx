// app/tienda/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product, Category } from '@/lib/types';
import { formatCRC } from '@/lib/format';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import CardSkeleton from '@/components/CardSkeleton'; // <-- Importamos el skeleton

const CATEGORIES: ('Todos' | Category)[] = ['Todos', 'Alimento', 'Higiene', 'Accesorios', 'Camas'];
const SORTS = [
  { id: 'relevance', label: 'Relevancia' },
  { id: 'price-asc', label: 'Precio más bajo' },
  { id: 'price-desc', label: 'Precio más alto' },
  { id: 'new', label: 'Novedades' },
] as const;

export default function TiendaPage() {
  const { items, loading } = useProducts();
  const { add } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('Todos');
  const [sort, setSort] = useState<(typeof SORTS)[number]['id']>('relevance');
  const [onlyStock, setOnlyStock] = useState(false);

  const list = useMemo(() => {
    let filteredList = items.slice();

    if (cat !== 'Todos') filteredList = filteredList.filter(p => p.category === cat);
    if (onlyStock) filteredList = filteredList.filter(p => p.inStock);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      filteredList = filteredList.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.short.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-asc') filteredList.sort((a, b) => a.priceCRC - b.priceCRC);
    if (sort === 'price-desc') filteredList.sort((a, b) => b.priceCRC - a.priceCRC);
    if (sort === 'new') filteredList.sort((a, b) => (b.tag === 'Nuevo' ? 1 : 0) - (a.tag === 'Nuevo' ? 1 : 0));
    if (sort === 'relevance') filteredList.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

    return filteredList;
  }, [items, cat, onlyStock, query, sort]);
  
  const pickEmoji = (p: Product) => {
    if (p.category === 'Alimento') return '🥣';
    if (p.category === 'Higiene') return '🧴';
    if (p.category === 'Accesorios') return '🧸';
    if (p.category === 'Camas') return '🛏️';
    return '🐷';
  };

  return (
    <main>
      {/* Hero mejorado */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-pink-light/30 via-brand-background to-white">
        {/* Elementos decorativos */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-brand-pink-light/40 to-brand-pink/30 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-tl from-brand-pink/20 to-brand-pink-light/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center space-y-8">
            {/* Badge superior */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
              <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
              Tienda Mini Pig
            </div>

            {/* Título principal */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-brand-dark">
                Todo para tu 
                <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Mini Pig</span>
              </h1>
              <p className="text-xl md:text-2xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
                Alimentación premium, productos de higiene, accesorios únicos y todo lo que necesitas para el bienestar de tu compañero.
              </p>
            </div>

            {/* Stats de productos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-brand-pink">{items.length}</div>
                <div className="text-sm text-brand-text-muted font-medium">Productos</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-brand-pink">{new Set(items.map(p => p.category)).size}</div>
                <div className="text-sm text-brand-text-muted font-medium">Categorías</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-brand-pink">{items.filter(p => p.inStock).length}</div>
                <div className="text-sm text-brand-text-muted font-medium">En Stock</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-brand-pink">24h</div>
                <div className="text-sm text-brand-text-muted font-medium">Envío rápido</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros mejorados */}
      <section className="bg-white/80 backdrop-blur-sm border-y border-brand-border">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid gap-6 md:grid-cols-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-brand-dark mb-2">Buscar productos</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, descripción o categoría..."
                className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark placeholder:text-brand-text-muted focus:border-brand-pink focus:outline-none transition-colors"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Categoría</label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value as any)}
                className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Ordenar */}
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Ordenar por</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors"
              >
                {SORTS.map((sortOption) => (
                  <option key={sortOption.id} value={sortOption.id}>{sortOption.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros adicionales */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyStock}
                  onChange={(e) => setOnlyStock(e.target.checked)}
                  className="w-4 h-4 text-brand-pink bg-white border-2 border-brand-border rounded focus:ring-brand-pink focus:ring-2"
                />
                <span className="text-sm font-medium text-brand-dark">Solo productos en stock</span>
              </label>
            </div>
            
            <div className="text-sm text-brand-text-muted">
              {list.length} producto{list.length === 1 ? '' : 's'} encontrado{list.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-2xl bg-gray-200 aspect-[4/3] mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">No encontramos productos</h3>
            <p className="text-brand-text-muted mb-6">Prueba ajustando los filtros de búsqueda</p>
            <button
              onClick={() => {
                setQuery('');
                setCat('Todos');
                setOnlyStock(false);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-semibold transition-all duration-300 hover:scale-105"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {list.map((p, index) => (
              <article 
                key={p.id} 
                className="group relative rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Imagen del producto */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-brand-pink-light to-pink-100 flex items-center justify-center text-7xl">
                    <span aria-hidden className="transform transition-transform duration-300 group-hover:scale-110">{pickEmoji(p)}</span>
                  </div>
                  
                  {/* Botón de favoritos */}
                  <button
                    onClick={() => toggleFavorite(p.id, p.name)}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-sm border transition-all duration-300 flex items-center justify-center ${
                      isFavorite(p.id) 
                        ? 'bg-red-100 border-red-200 text-red-500 hover:scale-110' 
                        : 'bg-white/80 border-white/50 text-gray-400 hover:text-red-400 hover:scale-110'
                    }`}
                    aria-label={isFavorite(p.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {isFavorite(p.id) ? '❤️' : '🤍'}
                  </button>

                  {/* Tag de producto */}
                  {p.tag && (
                    <div className="absolute top-3 left-3 rounded-full bg-brand-pink text-white px-3 py-1 text-xs font-bold">
                      {p.tag}
                    </div>
                  )}

                  {/* Indicador de stock */}
                  <div className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-bold ${
                    p.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {p.inStock ? 'En stock' : 'Agotado'}
                  </div>
                </div>

                {/* Información del producto */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-brand-dark group-hover:text-brand-pink-dark transition-colors duration-300">
                      {p.name}
                    </h3>
                    <p className="text-sm text-brand-text-muted mt-1 line-clamp-2">
                      {p.short}
                    </p>
                  </div>

                  {/* Precio y acciones */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black text-brand-pink font-mono">
                      {formatCRC(p.priceCRC)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/tienda/${p.id}`} 
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver
                      </Link>
                      
                      <button 
                        disabled={!p.inStock} 
                        onClick={() => add({ id: p.id, name: p.name, priceCRC: p.priceCRC }, 1)} 
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                          p.inStock 
                            ? 'bg-brand-pink hover:bg-brand-pink-dark text-white shadow-lg hover:shadow-xl' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {p.inStock ? 'Añadir' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Elementos decorativos */}
                <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-brand-pink opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="absolute bottom-4 right-4 w-1 h-1 rounded-full bg-brand-pink-dark opacity-30 group-hover:opacity-80 transition-opacity duration-300" />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
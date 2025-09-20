// app/favoritos/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/lib/types';
import { formatCRC } from '@/lib/format';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-hot-toast';

type SortKey = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

function pickEmoji(p: Product) {
  if (p.category === 'Alimento') return '🥣';
  if (p.category === 'Higiene') return '🧴';
  if (p.category === 'Accesorios') return '🧸';
  if (p.category === 'Camas') return '🛏️';
  return '🐷';
}

export default function FavoritosPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { items: allProducts, loading } = useProducts();
  const { add: addToCart } = useCart();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const categories = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.category && set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [allProducts]);

  const favoriteProducts = useMemo(
    () => allProducts.filter((p) => favorites.includes(p.id)),
    [allProducts, favorites]
  );

  const filtered = useMemo(() => {
    let list = [...favoriteProducts];

    // Buscar
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.short || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
      );
    }

    // Categoría
    if (category !== 'all') {
      list = list.filter((p) => p.category === category);
    }

    // Orden
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => (a.priceCRC || 0) - (b.priceCRC || 0));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.priceCRC || 0) - (a.priceCRC || 0));
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        // Si tienes createdAt en productos, puedes usarlo aquí para “más recientes”
        // list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
    }

    return list;
  }, [favoriteProducts, query, category, sort]);

  const handleAddAll = () => {
    const available = filtered.filter((p) => p.inStock);
    if (available.length === 0) {
      toast('No hay productos disponibles para agregar.');
      return;
    }
    available.forEach((p) => addToCart({ id: p.id, name: p.name, priceCRC: p.priceCRC }, 1));
    toast.success(`Agregados ${available.length} producto(s) al carrito`);
  };

  const handleClearAll = () => {
    if (filtered.length === 0) {
      toast('No hay favoritos para quitar.');
      return;
    }
    const ok = window.confirm('¿Quitar todos los favoritos filtrados? Esta acción no se puede deshacer.');
    if (!ok) return;
    filtered.forEach((p) => toggleFavorite(p.id, p.name));
    toast.success('Favoritos actualizados.');
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">Mis Favoritos ❤️</h1>
        <p className="mt-1 text-brand-text-muted">Guarda y organiza tus productos preferidos para tu mini pig.</p>
      </header>

      {/* Controles */}
      <section className="rounded-xl border border-brand-border bg-white/90 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-text-muted mb-1">Buscar</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, categoría o descripción"
              className="input-style"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text-muted mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-style"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'Todas' : c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text-muted mb-1">Ordenar por</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input-style"
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio (menor a mayor)</option>
              <option value="price-desc">Precio (mayor a menor)</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button onClick={handleAddAll} className="btn-pig text-sm px-4 py-2">
            Añadir todo al carrito
          </button>
          <button onClick={handleClearAll} className="btn-outline-pig text-sm px-4 py-2">
            Quitar todos (filtrados)
          </button>
          <Link href="/tienda" className="btn-outline-pig text-sm px-4 py-2">
            Explorar más productos
          </Link>
        </div>
      </section>

      {/* Cargando */}
      {loading && (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-gray-200" />
          ))}
        </div>
      )}

      {/* Vacío */}
      {!loading && filtered.length === 0 && (
        <div className="mt-6 rounded-xl border border-brand-border bg-white/90 p-8 text-center">
          <p className="text-brand-text-muted">No encontramos favoritos con esos filtros.</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setCategory('all');
                setQuery('');
                setSort('newest');
              }}
              className="btn-outline-pig"
            >
              Limpiar filtros
            </button>
            <Link href="/tienda" className="btn-pig">
              Ir a la tienda
            </Link>
          </div>
        </div>
      )}

      {/* Grid de productos favoritos */}
      {!loading && filtered.length > 0 && (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-brand-border bg-white/90 shadow-sm p-4 flex flex-col group"
            >
              {/* Imagen / emoji */}
              <div className="relative aspect-[4/3] grid place-items-center rounded-lg bg-gradient-to-tr from-rose-100 to-pink-100 text-6xl">
                <span aria-hidden>{pickEmoji(p)}</span>

                {/* Botón Quitar */}
                <button
                  onClick={() => toggleFavorite(p.id, p.name)}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 text-xl text-red-500 transition-transform hover:scale-110"
                  aria-label={`Quitar ${p.name} de favoritos`}
                  title="Quitar de favoritos"
                >
                  ❤️
                </button>

                {/* Badge de stock */}
                <span
                  className={`absolute left-2 bottom-2 rounded-full px-2 py-1 text-[10px] font-semibold ${
                    p.inStock ? 'bg-green-600/90 text-white' : 'bg-gray-400/90 text-white'
                  }`}
                >
                  {p.inStock ? 'Disponible' : 'Agotado'}
                </span>
              </div>

              {/* Info */}
              <div className="mt-3 flex-1">
                <h3 className="font-semibold text-brand-dark">{p.name}</h3>
                <p className="mt-1 text-sm text-brand-text-muted line-clamp-2">{p.short}</p>
              </div>

              {/* Pie */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-brand-dark font-semibold">{formatCRC(p.priceCRC)}</span>
                <button
                  disabled={!p.inStock}
                  onClick={() => {
                    if (!p.inStock) return;
                    addToCart({ id: p.id, name: p.name, priceCRC: p.priceCRC }, 1);
                    toast.success('Agregado al carrito');
                  }}
                  className={
                    'text-xs px-3 py-2 rounded-md transition ' +
                    (p.inStock
                      ? 'bg-brand-pink text-white hover:bg-brand-pink-dark'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed')
                  }
                >
                  {p.inStock ? 'Añadir al carrito' : 'Agotado'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

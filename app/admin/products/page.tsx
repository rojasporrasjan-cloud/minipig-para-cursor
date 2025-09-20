// app/admin/products/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/lib/types';
import { formatCRC } from '@/lib/format';
import { deleteProduct } from '@/lib/firestore/products';
import toast from 'react-hot-toast';

// --- Iconos para una mejor interfaz ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;


export default function AdminProductsPage() {
  const { items: products, loading } = useProducts();

  const handleDelete = (product: Product) => {
    toast((t) => (
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-medium">¿Eliminar "{product.name}"?</p>
        <p className="text-sm text-gray-600">Esta acción no se puede deshacer.</p>
        <div className="flex gap-3 mt-3">
          <button
            className="btn-primary bg-red-600 hover:bg-red-700 text-xs px-4 py-1.5"
            onClick={() => {
              const promise = deleteProduct(product.id);
              toast.promise(promise, {
                loading: 'Eliminando...',
                success: 'Producto eliminado.',
                error: 'No se pudo eliminar.',
              });
              toast.dismiss(t.id);
            }}
          >
            Sí, eliminar
          </button>
          <button
            className="btn-ghost bg-gray-100 hover:bg-gray-200 text-xs px-4 py-1.5"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
    });
  };

  if (loading) {
    return <div className="text-center py-10">Cargando productos...</div>;
  }
  
  return (
    <div className="space-y-8">
        {/* Header mejorado */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
            <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
            Gestión de Productos
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
              Nuestra 
              <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Tienda</span>
            </h1>
            <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
          </div>
          <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
            Administra todos los productos disponibles en tu tienda online
          </p>
          
          <Link 
            href="/admin/products/new" 
            className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-bold text-lg transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95"
          >
            <AddIcon />
            Agregar Nuevo Producto
          </Link>
        </header>

        {/* Tabla mejorada */}
        <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-purple-100/50 to-brand-pink-light/20">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-brand-dark">Producto</th>
                  <th className="px-6 py-4 text-left font-bold text-brand-dark">Categoría</th>
                  <th className="px-6 py-4 text-left font-bold text-brand-dark">Precio</th>
                  <th className="px-6 py-4 text-left font-bold text-brand-dark">Estado</th>
                  <th className="px-6 py-4 text-right font-bold text-brand-dark">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {products.length > 0 ? products.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-purple-50/30 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                          🛍️
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark">{product.name}</p>
                          <p className="text-sm text-brand-text-muted">ID: {product.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xl font-black text-brand-pink font-mono">
                        {formatCRC(product.priceCRC)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300
                        ${product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      `}>
                        <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                        {product.inStock ? 'En Stock' : 'Agotado'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/products/edit/${product.id}`} 
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
                        >
                          <EditIcon />
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
                          title="Eliminar Producto"
                        >
                          <DeleteIcon />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                          <span className="text-2xl">🛍️</span>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-brand-dark">No hay productos en la tienda</p>
                          <p className="text-brand-text-muted">Comienza agregando tu primer producto</p>
                        </div>
                        <Link 
                          href="/admin/products/new"
                          className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-semibold transition-all duration-300 hover:scale-105"
                        >
                          <AddIcon />
                          Agregar Primer Producto
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats adicionales */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-brand-pink">{products.length}</div>
              <div className="text-sm text-brand-text-muted font-medium">Total Productos</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-brand-pink">
                {products.filter(p => p.inStock).length}
              </div>
              <div className="text-sm text-brand-text-muted font-medium">En Stock</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-brand-pink">
                {new Set(products.map(p => p.category)).size}
              </div>
              <div className="text-sm text-brand-text-muted font-medium">Categorías</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-brand-pink">
                {products.filter(p => p.stock && p.stock < 5).length}
              </div>
              <div className="text-sm text-brand-text-muted font-medium">Bajo Stock</div>
            </div>
          </div>
        )}
      </div>
  );
}
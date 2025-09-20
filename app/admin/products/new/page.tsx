"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, Tag } from '@/lib/types';
import { upsertProduct } from '@/lib/firestore/products';
import BackButton from '@/components/BackButton';
import ImageUploader from '@/components/admin/ImageUploader';
import toast from 'react-hot-toast';
import { uploadImage } from '@/lib/firebase/storage';

const CATEGORIES: Category[] = ['Alimento', 'Higiene', 'Accesorios', 'Camas'];
const TAGS: (Tag | '')[] = ['', 'Top ventas', 'Nuevo', 'Popular', 'Confort'];

const initialFormState: Partial<Product> = {
  id: '', name: '', priceCRC: 0, category: 'Accesorios',
  tag: undefined, short: '', inStock: true, stock: 10,
  featured: false, images: []
};

export default function NewProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setForm(prev => ({ 
      ...prev, 
      [name]: isCheckbox ? checked : ((name === 'priceCRC' || name === 'stock') ? Number(value) : value)
    }));
  };
  
  const handleImagesChange = (files: File[]) => {
    setImageFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.id.trim().match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
      toast.error('El "ID (slug)" es obligatorio y solo puede contener minúsculas, números y guiones.');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Creando producto...');
    
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        toast.loading('Subiendo imágenes...', { id: toastId });
        imageUrls = await Promise.all(
          imageFiles.map(file => uploadImage(file, 'products'))
        );
      }

      const productData: Partial<Product> = {
        ...form,
        images: imageUrls,
        photoUrl: imageUrls[0] || null,
      };

      toast.loading('Guardando en la base de datos...', { id: toastId });
      await upsertProduct(productData);
      
      toast.success('¡Producto creado con éxito!', { id: toastId });
      router.push('/admin/products');

    } catch(err: any) {
      console.error(err);
      toast.error(`Error: ${err.message || 'No se pudo crear el producto.'}`, { id: toastId });
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-8">
        {/* Navegación */}
        <div className="flex items-center gap-4">
          <BackButton href="/admin/products" label="← Volver a Productos" />
        </div>
        
        {/* Header mejorado */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
            <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
            Agregar Producto
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
              Nuevo 
              <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Producto</span>
            </h1>
            <p className="text-xl text-brand-text-muted">
              Agrega un nuevo producto a tu tienda
            </p>
          </div>
        </header>

        {/* Formulario mejorado */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-2xl p-8 space-y-8 animate-fade-in-up">
            
            {/* Subir imágenes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-sm">📸</span>
                </div>
                <h3 className="text-lg font-bold text-brand-dark">Fotos del Producto</h3>
              </div>
              <ImageUploader existingImages={[]} onImagesChange={handleImagesChange} />
            </div>
            
            {/* Información del producto */}
            <div className="space-y-6 border-t border-brand-border pt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-sm">📝</span>
                </div>
                <h3 className="text-lg font-bold text-brand-dark">Información del Producto</h3>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                  <span>🔗</span> ID (slug)
                </label>
                <input 
                  id="id" 
                  type="text" 
                  name="id" 
                  value={form.id} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors" 
                  required 
                  placeholder="ej: alimento-premium-5kg"
                />
                <p className="text-xs text-brand-text-muted">Solo minúsculas, números y guiones. Será la URL del producto.</p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                  <span>🛍️</span> Nombre del Producto
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors" 
                  required 
                  placeholder="Ej: Pellets Premium 5kg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                    <span>💰</span> Precio (₡)
                  </label>
                  <input 
                    type="number" 
                    name="priceCRC" 
                    value={form.priceCRC || 0} 
                    onChange={handleChange} 
                    className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors" 
                    required 
                    placeholder="25000"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                    <span>📦</span> Stock
                  </label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={form.stock || ''} 
                    onChange={handleChange} 
                    className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors" 
                    placeholder="Ej: 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                    <span>📂</span> Categoría
                  </label>
                  <select 
                    name="category" 
                    value={form.category || ''} 
                    onChange={handleChange} 
                    className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors" 
                    required
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {c === 'Alimento' ? '🥣' : 
                         c === 'Higiene' ? '🧴' : 
                         c === 'Accesorios' ? '🧸' : '🛏️'} {c}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                    <span>🏷️</span> Etiqueta
                  </label>
                  <select 
                    name="tag" 
                    value={form.tag || ''} 
                    onChange={handleChange} 
                    className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors"
                  >
                    {TAGS.map(t => (
                      <option key={t} value={t}>{t || 'Ninguna'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                  <span>📄</span> Descripción
                </label>
                <textarea 
                  name="short" 
                  value={form.short || ''} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors resize-none" 
                  rows={3} 
                  required 
                  placeholder="Describe las características y beneficios del producto..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-background/50 border border-brand-border">
                  <input 
                    id="inStock" 
                    type="checkbox" 
                    name="inStock" 
                    checked={!!form.inStock} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-brand-pink bg-white border-2 border-brand-border rounded focus:ring-brand-pink focus:ring-2" 
                  />
                  <label htmlFor="inStock" className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                    <span>📦</span> En Stock
                  </label>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-background/50 border border-brand-border">
                  <input 
                    id="featured" 
                    type="checkbox" 
                    name="featured" 
                    checked={!!form.featured} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-brand-pink bg-white border-2 border-brand-border rounded focus:ring-brand-pink focus:ring-2" 
                  />
                  <label htmlFor="featured" className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                    <span>⭐</span> Producto Destacado
                  </label>
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <div className="border-t border-brand-border pt-8">
              <button 
                type="submit" 
                disabled={isSaving} 
                className="w-full rounded-xl bg-brand-pink hover:bg-brand-pink-dark px-6 py-4 text-white font-bold transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creando Producto...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Crear Producto
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
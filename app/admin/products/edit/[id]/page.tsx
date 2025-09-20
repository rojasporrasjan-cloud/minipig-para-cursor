// app/admin/products/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { Product, Category, Tag } from '@/lib/types';
import { upsertProduct } from '@/lib/firestore/products';
import AuthGate from '@/components/AuthGate';
import BackButton from '@/components/BackButton';
import ImageUploader from '@/components/admin/ImageUploader';
import toast from 'react-hot-toast';

const CATEGORIES: Category[] = ['Alimento', 'Higiene', 'Accesorios', 'Camas'];
const TAGS: (Tag | '')[] = ['', 'Top ventas', 'Nuevo', 'Popular', 'Confort'];

const EMPTY_FORM: Omit<Product, 'createdAt' | 'updatedAt'> = {
  id: '', name: '', priceCRC: 0, category: 'Accesorios', short: '', inStock: true, featured: false, stock: 0, photoUrl: ''
};

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Product;
          setForm({
              ...data,
              tag: data.tag || undefined
          });
        } else {
          toast.error('Producto no encontrado.');
          router.push('/admin/products');
        }
      } catch (error) {
        toast.error('Error al cargar el producto.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
        setForm(prev => ({ ...prev, [name]: (name === 'priceCRC' || name === 'stock') ? Number(value) : value }));
    }
  };

  const handleImagesChange = (files: File[], imageUrls: string[]) => {
    setImageFiles(files);
    if (!form.photoUrl && imageUrls.length > 0) {
      setForm(prev => ({ ...prev, photoUrl: imageUrls[0] }));
    } else if (imageUrls.length === 0) {
      setForm(prev => ({ ...prev, photoUrl: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const productData = {
        ...form,
        tag: form.tag || undefined,
        photoUrl: form.photoUrl?.trim() || undefined,
    };

    const promise = upsertProduct(productData);
    toast.promise(promise, {
      loading: 'Actualizando producto...',
      success: '¡Producto actualizado!',
      error: (err) => `Error: ${err.message || 'No se pudo actualizar.'}`,
    });
    
    try {
      await promise;
      router.push('/admin/products');
    } catch(error) {
      console.error(error);
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return <AuthGate><div className="text-center py-10">Cargando producto...</div></AuthGate>;
  }

  return (
    <AuthGate>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <BackButton href="/admin/products" label="← Volver a Productos" />
        </div>
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#8B5E34]">Editar Producto</h1>
          <p className="text-md text-[#6B625B] mt-1">Modifica los detalles del producto seleccionado.</p>
        </header>
        
        <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6 border border-gray-200 shadow-lg">
          <ImageUploader existingImages={form.photoUrl ? [form.photoUrl] : []} onImagesChange={handleImagesChange} />

          <div className="border-t pt-6">
            <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">O ingresa una URL de imagen principal</label>
            <input id="photoUrl" type="text" name="photoUrl" value={form.photoUrl || ''} onChange={handleChange} className="mt-1 input-style" placeholder="https://..."/>
          </div>

          <div className="border-t pt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID (slug)</label>
              <input type="text" value={form.id} className="mt-1 input-style bg-gray-100" disabled />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
              <input id="name" type="text" name="name" value={form.name} onChange={handleChange} className="mt-1 input-style" required />
            </div>
            {/* ... el resto del formulario se mantiene igual ... */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priceCRC" className="block text-sm font-medium text-gray-700">Precio (₡)</label>
                <input id="priceCRC" type="number" name="priceCRC" value={form.priceCRC} onChange={handleChange} className="mt-1 input-style" required />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock (unidades)</label>
                <input id="stock" type="number" name="stock" value={form.stock || ''} onChange={handleChange} className="mt-1 input-style" placeholder="Ej: 10"/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                  <select id="category" name="category" value={form.category} onChange={handleChange} className="mt-1 input-style" required>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
              </div>
              <div>
                  <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Etiqueta (Opcional)</label>
                  <select id="tag" name="tag" value={form.tag || ''} onChange={handleChange} className="mt-1 input-style">
                      {TAGS.map(t => <option key={t} value={t}>{t || 'Ninguna'}</option>)}
                  </select>
              </div>
            </div>
            <div>
              <label htmlFor="short" className="block text-sm font-medium text-gray-700">Descripción Corta</label>
              <textarea id="short" name="short" value={form.short} onChange={handleChange} className="mt-1 input-style" rows={3} required />
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center gap-3">
                <input id="inStock" type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                <label htmlFor="inStock" className="text-sm font-medium text-gray-700">En Stock</label>
              </div>
              <div className="flex items-center gap-3">
                <input id="featured" type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Producto Destacado</label>
              </div>
            </div>
          </div>

          <div className="text-right border-t pt-6">
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </AuthGate>
  );
}
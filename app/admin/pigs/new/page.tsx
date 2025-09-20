"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import BackButton from "@/components/BackButton";
import { PigStatus } from "@/lib/types/pig";
import { uploadImage } from "@/lib/firebase/storage";
import toast from "react-hot-toast";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewPigPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    priceCRC: 0,
    ageMonths: 2,
    sex: "",
    description: "",
    status: 'disponible' as PigStatus,
    visibility: 'public' as 'public' | 'private',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'priceCRC' || name === 'ageMonths' ? Number(value) : value }));
  };
  
  const handleImagesChange = (files: File[]) => {
    setImageFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("El nombre del cerdito es obligatorio.");
      return;
    }
    if (!form.sex) {
      toast.error("Por favor, selecciona el sexo del cerdito.");
      return;
    }
    
    // --- REGLA DE IMAGEN DESACTIVADA ---
    // if (imageFiles.length === 0) {
    //   toast.error("Debes añadir al menos una imagen del cerdito.");
    //   return;
    // }

    setIsSaving(true);
    const toastId = toast.loading('Iniciando guardado...');

    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        toast.loading(`Subiendo ${imageFiles.length} imágenes...`, { id: toastId });
        imageUrls = await Promise.all(
          imageFiles.map(file => uploadImage(file, 'pigs'))
        );
      }

      toast.loading('Creando expediente en la base de datos...', { id: toastId });
      await addDoc(collection(db, "pigs"), {
        ...form,
        name_lowercase: form.name.toLowerCase(),
        images: imageUrls, // Guardará un array vacío si no hay imágenes
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('¡Cerdito añadido con éxito!', { id: toastId });
      router.push("/admin/pigs");

    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message || 'No se pudo crear el cerdito.'}`, { id: toastId });
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
        {/* Header y navegación */}
        <div className="flex items-center gap-4">
          <BackButton href="/admin/pigs" label="← Volver a Cerditos" />
        </div>
        
        {/* Header mejorado */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
            <span className="flex h-2 w-2 rounded-full bg-brand-pink animate-pulse"></span>
            Agregar Mini Pig
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
              Nuevo 
              <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Mini Pig</span>
            </h1>
            <p className="text-xl text-brand-text-muted">
              Registra un nuevo mini pig en el sistema
            </p>
          </div>
        </header>

        {/* Formulario mejorado */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-2xl p-8 space-y-8 animate-fade-in-up">
            
            {/* Subir imágenes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-sm">📸</span>
                </div>
                <h3 className="text-lg font-bold text-brand-dark">Fotos del Mini Pig</h3>
              </div>
              <ImageUploader existingImages={[]} onImagesChange={handleImagesChange} />
            </div>
            
            {/* Información básica */}
            <div className="space-y-6 border-t border-brand-border pt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-sm">📝</span>
                </div>
                <h3 className="text-lg font-bold text-brand-dark">Información Básica</h3>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                  <span>🐷</span> Nombre del Mini Pig
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors" 
                  placeholder="Ej: Pepito, Luna, etc."
                  required 
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
                    value={form.priceCRC} 
                    onChange={handleChange} 
                    className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors" 
                    placeholder="250000"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                    <span>📅</span> Edad (meses)
                  </label>
                  <input 
                    type="number" 
                    name="ageMonths" 
                    value={form.ageMonths} 
                    onChange={handleChange} 
                    className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors" 
                    min="1"
                    max="60"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                  <span>⚧️</span> Sexo
                </label>
                <select 
                  name="sex" 
                  value={form.sex} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors" 
                  required
                >
                  <option value="">Seleccionar sexo...</option>
                  <option value="hembra">🐷 Hembra</option>
                  <option value="macho">🐷 Macho</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                  <span>📄</span> Descripción
                </label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors resize-none" 
                  rows={4}
                  placeholder="Describe la personalidad, características especiales, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                    <span>📊</span> Estado Inicial
                  </label>
                  <select 
                    name="status" 
                    value={form.status} 
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-600 cursor-not-allowed" 
                    disabled
                  >
                    <option value="disponible">🟢 Disponible</option>
                  </select>
                  <p className="text-xs text-brand-text-muted">Los nuevos mini pigs siempre inician como disponibles</p>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-brand-dark">
                    <span>👁️</span> Visibilidad
                  </label>
                  <select 
                    name="visibility" 
                    value={form.visibility} 
                    onChange={handleChange} 
                    className="w-full rounded-xl border-2 border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-pink focus:outline-none transition-colors"
                  >
                    <option value="public">🌍 Público (visible en adopciones)</option>
                    <option value="private">🔒 Privado (solo admin)</option>
                  </select>
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
                    Guardando Mini Pig...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Mini Pig
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
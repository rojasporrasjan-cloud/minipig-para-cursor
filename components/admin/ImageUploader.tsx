// components/admin/ImageUploader.tsx
'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

// --- Iconos para la interfaz ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const RemoveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

interface ImagePreview {
  file?: File;
  url: string;
}

interface ImageUploaderProps {
  existingImages: string[];
  onImagesChange: (files: File[], imageUrls: string[]) => void;
}

export default function ImageUploader({ existingImages, onImagesChange }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>(
    existingImages.map(url => ({ url }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    
    // Notificar al componente padre sobre los cambios
    const allFiles = updatedPreviews.map(p => p.file).filter((f): f is File => !!f);
    const allUrls = updatedPreviews.map(p => p.url);
    onImagesChange(allFiles, allUrls);
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
    setPreviews(updatedPreviews);

    // Limpiar la URL del objeto para evitar fugas de memoria
    const removedPreview = previews[indexToRemove];
    if (removedPreview.file) {
      URL.revokeObjectURL(removedPreview.url);
    }
    
    // Notificar al componente padre sobre los cambios
    const allFiles = updatedPreviews.map(p => p.file).filter((f): f is File => !!f);
    const allUrls = updatedPreviews.map(p => p.url);
    onImagesChange(allFiles, allUrls);
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del Producto</label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {previews.map((img, index) => (
          <div key={index} className="relative group aspect-square">
            <Image
              src={img.url}
              alt={`Vista previa ${index + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 20vw"
              className="object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-white/80 text-red-600 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Eliminar imagen"
            >
              <RemoveIcon />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-pink-400 hover:text-pink-600 transition-colors"
          aria-label="Añadir imágenes"
        >
          <UploadIcon />
          <span className="text-xs mt-1">Añadir</span>
        </button>
      </div>
      <input
        type="file"
        multiple
        accept="image/png, image/jpeg, image/webp"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
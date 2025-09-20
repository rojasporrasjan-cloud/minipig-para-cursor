// components/account/ShareStoryModal.tsx
'use client';

import { useState } from 'react';
import { Pig } from '@/lib/types/pig';
import { useUserProfile } from '@/hooks/useUserProfile';
import { uploadImage } from '@/lib/firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import toast from 'react-hot-toast';
import ImageUploader from '../admin/ImageUploader';

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pigs: Pig[]; // La lista de cerditos que el usuario ha adoptado
}

export default function ShareStoryModal({ isOpen, onClose, pigs }: ShareStoryModalProps) {
  const { user, userProfile } = useUserProfile();
  const [selectedPigId, setSelectedPigId] = useState<string>(pigs[0]?.id || '');
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (files: File[]) => {
    if (files.length > 0) {
      setImageFile(files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPigId || !text.trim() || !imageFile) {
      toast.error("Por favor, selecciona un cerdito, escribe tu historia y sube una foto.");
      return;
    }
    if (!user || !userProfile) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Enviando tu historia...');

    try {
      // 1. Subir la imagen a Firebase Storage
      const imageUrl = await uploadImage(imageFile, `testimonials/${user.uid}`);

      // 2. Preparar los datos para guardar en Firestore
      const selectedPig = pigs.find(p => p.id === selectedPigId);
      const testimonialData = {
        userId: user.uid,
        userName: userProfile.displayName,
        pigId: selectedPigId,
        pigName: selectedPig?.name || 'Mi cerdito',
        text: text,
        imageUrl: imageUrl,
        status: 'pending', // Siempre pendiente de tu aprobación
        createdAt: serverTimestamp(),
      };

      // 3. Guardar la historia en la nueva colección 'testimonials'
      await addDoc(collection(db, 'testimonials'), testimonialData);

      toast.success('¡Gracias! Tu historia ha sido enviada para su revisión.', { id: toastId });
      onClose();
      
    } catch (error: any) {
      console.error("Error al enviar la historia:", error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="card p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
        <h2 className="text-2xl font-bold text-brand-dark mb-4">Comparte tu Historia Feliz</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pig-select" className="block text-sm font-medium text-gray-700">¿Sobre qué cerdito es tu historia?</label>
            <select
              id="pig-select"
              value={selectedPigId}
              onChange={(e) => setSelectedPigId(e.target.value)}
              className="mt-1 input-style"
            >
              {pigs.map(pig => (
                <option key={pig.id} value={pig.id}>{pig.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="story-text" className="block text-sm font-medium text-gray-700">Tu historia o anécdota</label>
            <textarea
              id="story-text"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 input-style"
              placeholder="Cuéntanos cómo ha sido tu experiencia..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sube tu foto favorita</label>
            {/* Usamos un ImageUploader modificado para una sola imagen */}
            <div className="mt-1">
                 <ImageUploader existingImages={[]} onImagesChange={handleImageChange} />
            </div>
          </div>
          <div className="text-right pt-4">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Enviando...' : 'Enviar mi Historia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// components/expediente/WelcomeChecklist.tsx
'use client';

import { useState } from 'react';
import { Pig } from '@/lib/types/pig';
import { welcomeKitChecklist } from '@/lib/welcomeKitTemplates';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import Link from 'next/link';

interface WelcomeChecklistProps {
  pig: Pig;
}

export default function WelcomeChecklist({ pig }: WelcomeChecklistProps) {
  // Usamos el estado local para una respuesta instantánea en la UI
  const [completedItems, setCompletedItems] = useState<string[]>(pig.completedChecklistItems || []);

  const handleToggle = async (itemId: string) => {
    const isCompleted = completedItems.includes(itemId);
    const pigRef = doc(db, 'pigs', pig.id!);

    // Actualizamos el estado local primero para que el cambio sea instantáneo
    if (isCompleted) {
      setCompletedItems(prev => prev.filter(id => id !== itemId));
    } else {
      setCompletedItems(prev => [...prev, itemId]);
    }

    // Luego, actualizamos la base de datos en segundo plano
    try {
      if (isCompleted) {
        await updateDoc(pigRef, { completedChecklistItems: arrayRemove(itemId) });
      } else {
        await updateDoc(pigRef, { completedChecklistItems: arrayUnion(itemId) });
      }
    } catch (error) {
      console.error("Error al actualizar la checklist:", error);
      // Si hay un error, revertimos el estado local
      setCompletedItems(pig.completedChecklistItems || []);
    }
  };
  
  const progress = (completedItems.length / welcomeKitChecklist.length) * 100;

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-brand-dark">🚀 Kit de Bienvenida: Primeros Pasos</h3>
      <p className="text-sm text-brand-text-muted mt-1">
        ¡Felicidades por tu nuevo amigo! Aquí tienes una guía para empezar con el pie derecho.
      </p>

      {/* Barra de Progreso */}
      <div className="mt-4">
        <div className="w-full bg-pink-100 rounded-full h-2.5">
          <div 
            className="bg-brand-pink h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {welcomeKitChecklist.map(item => {
          const isChecked = completedItems.includes(item.id);
          return (
            <div key={item.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                id={item.id}
                checked={isChecked}
                onChange={() => handleToggle(item.id)}
                className="mt-1 h-5 w-5 rounded-md border-gray-300 text-brand-pink focus:ring-brand-pink"
              />
              <label htmlFor={item.id} className={`flex-1 text-sm ${isChecked ? 'text-gray-400 line-through' : 'text-brand-dark'}`}>
                {item.text}
                {item.link && (
                  <Link href={item.link} className="ml-2 text-xs text-brand-pink hover:underline">
                    (Ver guía)
                  </Link>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
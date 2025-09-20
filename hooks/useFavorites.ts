// hooks/useFavorites.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const FAVORITES_KEY = 'minipig_favorites_v1';

function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  const toggleFavorite = useCallback((productId: string, productName?: string) => {
    const isCurrentlyFavorite = favorites.includes(productId);
    
    setFavorites(prev => {
      const newFavorites = isCurrentlyFavorite
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });

    if (isCurrentlyFavorite) {
      toast(`"${productName || 'Producto'}" eliminado de favoritos`);
    } else {
      toast.success(`❤️ "${productName || 'Producto'}" añadido a favoritos`);
    }
  }, [favorites]);

  return { favorites, isFavorite, toggleFavorite };
}
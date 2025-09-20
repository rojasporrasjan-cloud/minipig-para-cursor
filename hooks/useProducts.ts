// hooks/useProducts.ts
'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { subscribeAllProducts } from '@/lib/firestore/products';

export function useProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAllProducts((list) => {
      setItems(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { items, loading };
}

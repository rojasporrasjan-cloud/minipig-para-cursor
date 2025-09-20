'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Sale } from '@/lib/types/sale';

export type CartItem = { id: string; name: string; priceCRC: number; qty: number; };

const KEY = 'mp_cart_v1';

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(readCart());
  // --- ESTADOS PARA EL CUPÓN RESTAURADOS ---
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => setItems(readCart());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.priceCRC * item.qty, 0), [items]);
  const discountAmount = useMemo(() => coupon ? (subtotal * coupon.discount) / 100 : 0, [subtotal, coupon]);
  const totalCRC = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);
  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items]);

  // --- FUNCIÓN PARA APLICAR EL CUPÓN RESTAURADA ---
  const applyCoupon = async (code: string) => {
    if (!code.trim()) return;
    setIsVerifyingCoupon(true);
    setCouponError(null);
    setCoupon(null);

    try {
      const salesRef = collection(db, 'sales');
      const q = query(
        salesRef, 
        where('welcomeCoupon.code', '==', code.toUpperCase()), 
        where('welcomeCoupon.status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setCouponError('El código del cupón no es válido o ya ha sido utilizado.');
        toast.error('Cupón no válido.');
      } else {
        const sale = querySnapshot.docs[0].data() as Sale;
        setCoupon({
          code: sale.welcomeCoupon!.code,
          discount: sale.welcomeCoupon!.discount,
        });
        toast.success(`¡${sale.welcomeCoupon!.discount}% de descuento aplicado!`);
      }
    } catch (error) {
      setCouponError('Ocurrió un error al verificar el cupón.');
      toast.error('Error al verificar el cupón.');
    } finally {
      setIsVerifyingCoupon(false);
    }
  };
  
  const add = useCallback((item: Omit<CartItem, 'qty'>, qty = 1) => {
    const current = readCart();
    const idx = current.findIndex((x) => x.id === item.id);
    if (idx >= 0) { current[idx].qty += qty; } else { current.push({ ...item, qty }); }
    localStorage.setItem(KEY, JSON.stringify(current));
    setItems(current); // Actualización inmediata
    toast.success(`🛒 "${item.name}" añadido al carrito`);
  }, []);

  const remove = useCallback((id: string) => {
    const updated = readCart().filter(item => item.id !== id);
    localStorage.setItem(KEY, JSON.stringify(updated));
    setItems(updated);
  }, []);
  
  const setQty = useCallback((id: string, qty: number) => {
    let current = readCart();
    if (qty <= 0) {
      current = current.filter(item => item.id !== id);
    } else {
      const idx = current.findIndex((x) => x.id === id);
      if (idx >= 0) current[idx].qty = qty;
    }
    localStorage.setItem(KEY, JSON.stringify(current));
    setItems(current);
  }, []);

  const clear = useCallback(() => {
    localStorage.setItem(KEY, JSON.stringify([]));
    setItems([]);
    setCoupon(null);
    toast('🗑️ Carrito vaciado');
  }, []);


  return { 
    items, count, subtotal, discountAmount, totalCRC, coupon, couponError, isVerifyingCoupon,
    add, remove, setQty, clear, applyCoupon 
  };
}
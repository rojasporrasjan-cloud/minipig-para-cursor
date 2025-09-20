// components/admin/CouponManager.tsx
'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function CouponManager() {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Por favor, ingresa un código de cupón.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Buscando cupón...');

    try {
      const salesRef = collection(db, 'sales');
      const q = query(
        salesRef, 
        where('welcomeCoupon.code', '==', couponCode.toUpperCase()),
        where('welcomeCoupon.status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error('Este cupón no es válido o ya fue utilizado.', { id: toastId });
        return;
      }
      
      // Encontramos el cupón, ahora lo marcamos como 'usado'
      const batch = writeBatch(db);
      const saleDocRef = querySnapshot.docs[0].ref;
      batch.update(saleDocRef, { 'welcomeCoupon.status': 'used' });
      await batch.commit();

      toast.success('¡Cupón canjeado y marcado como usado!', { id: toastId });
      setCouponCode('');

    } catch (error: any) {
      console.error("Error al canjear el cupón:", error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-brand-dark">Canjear Cupón de Bienvenida</h3>
      <p className="text-sm text-brand-text-muted mt-1">
        Cuando un cliente pague usando un cupón, ingrésalo aquí para marcarlo como usado y evitar que se vuelva a utilizar.
      </p>
      <form onSubmit={handleRedeem} className="mt-4 flex gap-2">
        <input 
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="BIENVENIDOCHANCHI15"
          className="input-style flex-grow"
        />
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Verificando...' : 'Canjear'}
        </button>
      </form>
    </div>
  );
}
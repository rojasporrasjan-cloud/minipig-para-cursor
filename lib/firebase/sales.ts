// lib/firebase/sales.ts
import { db } from './client';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, runTransaction, getDoc } from 'firebase/firestore';
import { Sale, WelcomeCoupon } from '../types/sale';
import { milestoneTemplates } from '../milestoneTemplates';
import { Milestone } from '../types/pig';

export const addSale = async (saleData: Omit<Sale, 'id'>) => {
  const salesCollection = collection(db, 'sales');
  const pigRef = doc(db, 'pigs', saleData.pigId);

  await runTransaction(db, async (transaction) => {
    // 1. Creamos la nueva venta
    const newSaleRef = doc(collection(db, 'sales'));
    transaction.set(newSaleRef, { ...saleData, createdAt: serverTimestamp() });
    
    // 2. Actualizamos el estado del cerdito a 'reservado'
    transaction.update(pigRef, { status: 'reservado' });
  });
};

export const updateSale = async (saleId: string, saleData: Omit<Sale, 'id'>) => {
  const saleRef = doc(db, 'sales', saleId);
  await runTransaction(db, async (transaction) => {
    const saleDoc = await transaction.get(saleRef);
    if (!saleDoc.exists()) throw new Error("¡La venta no existe!");
    
    const originalStatus = saleDoc.data().status;
    const newStatus = saleData.status;

    // Lógica para el cupón
    if (newStatus === 'entregado' && originalStatus !== 'entregado' && !saleDoc.data().welcomeCoupon) {
        const pigName = saleData.pigName.split(' ')[0].toUpperCase();
        const couponCode = `BIENVENIDO${pigName}15`;
        (saleData as Sale).welcomeCoupon = {
            code: couponCode,
            discount: 15,
            status: 'active',
        };
    }
    
    transaction.update(saleRef, { ...saleData, updatedAt: serverTimestamp() });

    const pigRef = doc(db, 'pigs', saleData.pigId);
    if (newStatus === 'reservado' || newStatus === 'pagado' || newStatus === 'entregado') {
        transaction.update(pigRef, { status: 'vendido', ownerId: saleData.customerId || null });
        
        if(newStatus === 'entregado' || newStatus === 'pagado') {
             const adoptionTemplate = milestoneTemplates.find(t => t.key === 'adopcion')!;
             const adoptionMilestone: Milestone = {
                id: `sale-${saleId}`,
                date: saleData.saleDate,
                title: adoptionTemplate.title,
                description: `¡El día más feliz! ${saleData.customerName} me dio un nuevo hogar.`,
                icon: adoptionTemplate.icon,
            };
            transaction.update(pigRef, { milestones: [adoptionMilestone] });
        }
    } else if (newStatus === 'cancelado' && originalStatus !== 'cancelado') {
        transaction.update(pigRef, { status: 'disponible', ownerId: null });
    }
  });
};

export const deleteSale = async (saleId: string) => {
  const saleRef = doc(db, 'sales', saleId);
  const saleDoc = await getDoc(saleRef);
  if (saleDoc.exists()) {
    const pigId = saleDoc.data().pigId;
    const pigRef = doc(db, 'pigs', pigId);
    // Al eliminar la venta, el cerdito vuelve a estar disponible
    await updateDoc(pigRef, { status: 'disponible', ownerId: null });
    await deleteDoc(saleRef);
  } else {
    throw new Error("Venta no encontrada para eliminar.");
  }
};
// lib/firestore/products.ts
import { db } from '@/lib/firebase/client';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  query,
  Unsubscribe,
  deleteDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { Product } from '@/lib/types';

// ... (la función toProduct se mantiene igual)
function toProduct(id: string, data: any): Product {
  return {
    id, name: data?.name ?? '', priceCRC: Number(data?.priceCRC ?? 0),
    category: data?.category, tag: data?.tag ?? undefined,
    photoUrl: data?.photoUrl ?? undefined,
    images: data?.images ?? (data?.photoUrl ? [data.photoUrl] : []),
    short: data?.short ?? '', stock: data?.stock ?? 0,
    inStock: Boolean(data?.inStock), featured: Boolean(data?.featured),
    createdAt: data?.createdAt ?? null, updatedAt: data?.updatedAt ?? null,
  };
}

// ... (subscribeAllProducts y subscribeProduct se mantienen igual)
export function subscribeAllProducts(cb: (items: Product[]) => void): Unsubscribe {
  const ref = collection(db, 'products');
  const q = query(ref);
  return onSnapshot(q, (snap) => {
    const list: Product[] = [];
    snap.forEach((d) => list.push(toProduct(d.id, d.data())));
    cb(list);
  });
}

export function subscribeProduct(id: string, cb: (item: Product | null) => void): Unsubscribe {
  const ref = doc(db, 'products', id);
  return onSnapshot(ref, (doc) => {
    cb(doc.exists() ? toProduct(doc.id, doc.data()) : null);
  });
}

// --- FUNCIÓN DE GUARDADO CORREGIDA Y MÁS ROBUSTA ---
export async function upsertProduct(p: Partial<Product>) {
  if (!p.id) throw new Error("El producto debe tener un ID.");
  if (typeof p.name !== 'string' || !p.name.trim()) throw new Error("El nombre del producto es obligatorio.");

  const ref = doc(db, 'products', p.id);
  const now = serverTimestamp();
  
  const dataToSet = {
    ...p,
    name_lowercase: p.name.toLowerCase(),
    updatedAt: now,
  };
  
  // Eliminamos cualquier campo `undefined` antes de enviarlo a Firestore
  Object.keys(dataToSet).forEach(key => (dataToSet as any)[key] === undefined && delete (dataToSet as any)[key]);

  const snap = await getDoc(ref);
  if (!snap.exists()) {
    (dataToSet as any).createdAt = now;
  }

  // set con merge:true es la forma más segura de crear o actualizar un documento.
  await setDoc(ref, dataToSet, { merge: true });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id));
}
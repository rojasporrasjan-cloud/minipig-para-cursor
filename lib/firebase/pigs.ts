import { db } from "./client";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Pig } from "@/lib/types/pig";

// db ya está importado desde client.ts
const pigsCol = collection(db, "pigs");

// Crear
export async function createPig(data: Omit<Pig, "id"|"createdAt"|"updatedAt">) {
  const now = serverTimestamp();
  const ref = await addDoc(pigsCol, { ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

// Listado público (orden por fecha)
export async function listPigsPublic() {
  const q = query(pigsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Pig));
}

// Obtener uno por id
export async function getPigById(id: string) {
  const ref = doc(db, "pigs", id);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Pig) : null;
}

// Listar por dueño
export async function listPigsByOwner(ownerId: string) {
  const q = query(pigsCol, where("ownerId", "==", ownerId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Pig));
}

// Actualizar
export async function updatePig(id: string, data: Partial<Pig>) {
  const ref = doc(db, "pigs", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// Eliminar
export async function deletePigById(id: string) {
  const ref = doc(db, "pigs", id);
  await deleteDoc(ref);
}

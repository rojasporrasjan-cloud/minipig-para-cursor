// lib/admin.ts
// CORRECCIÓN: Apunta al archivo de cliente unificado
import { auth, db } from '@/lib/firebase/client'; 
import {
  doc, getDoc, setDoc, deleteDoc, updateDoc,
  collection, onSnapshot, query, orderBy, serverTimestamp, Unsubscribe,
} from 'firebase/firestore';

// ... (El resto del código de admin se mantiene igual) ...

/** Estructura de un admin en Firestore (/admins/{uid}) */
export type AdminDoc = {
  role: 'owner' | 'admin';
  email?: string | null;
  displayName?: string | null;
  createdAt?: any;
  updatedAt?: any;
};

// Exportamos el tipo para poder usarlo en otros componentes
export type AdminRole = 'owner' | 'admin';

/** 🔎 Lee rol en /users/{uid} */
export async function isAdminByDoc(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return false;

  const data = snap.data() as any;
  const isOwner = data?.role === 'owner' || data?.roles?.owner === true;
  const isAdmin = data?.role === 'admin' || data?.roles?.admin === true;

  return Boolean(isOwner || isAdmin);
}

/** ✅ Verifica si el UID es admin/owner: claims → /users/{uid} */
export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const current = auth.currentUser;

    if (current && current.uid === uid) {
      try {
        const token = await current.getIdTokenResult(true);
        const claims = token.claims as any;
        const byClaims =
          claims?.role === 'owner' ||
          claims?.owner === true ||
          claims?.role === 'admin' ||
          claims?.admin === true;

        if (byClaims) return true;
      } catch {
        /* seguimos a Firestore */
      }
    }

    return await isAdminByDoc(uid);
  } catch {
    return false;
  }
}

/** 📡 Lista en vivo de /admins (requiere reglas que permitan list a admins) */
export function subscribeAdmins(
  callback: (items: (AdminDoc & { uid: string })[]) => void
): Unsubscribe | undefined {
  try {
    const q = query(collection(db, 'admins'), orderBy('role', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: (AdminDoc & { uid: string })[] = [];
        snap.forEach((docSnap) => list.push({ uid: docSnap.id, ...(docSnap.data() as AdminDoc) }));
        callback(list);
      },
      (err) => console.error('[subscribeAdmins] Error:', err)
    );
    return unsub;
  } catch (e) {
    console.error('[subscribeAdmins] Excepción:', e);
    return undefined;
  }
}

/** ➕ Crear/ascender admin en /admins y reflejar en /users/{uid} */
export async function addAdmin(uid: string, role: 'admin' | 'owner', meta?: Partial<AdminDoc>) {
  const now = serverTimestamp();
  await setDoc(
    doc(db, 'admins', uid),
    {
      role,
      email: meta?.email ?? null,
      displayName: meta?.displayName ?? null,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true }
  );
  await setDoc(
    doc(db, 'users', uid),
    {
      role: role === 'owner' ? 'owner' : 'admin',
      roles: { owner: role === 'owner', admin: true },
      updatedAt: now,
    },
    { merge: true }
  );
}

/** 📝 Actualizar metadatos del admin (no cambia rol) */
export async function updateAdminMeta(uid: string, meta: Partial<AdminDoc>) {
  await updateDoc(doc(db, 'admins', uid), { ...meta, updatedAt: serverTimestamp() });
}

/** ➖ Quitar admin (no borra /users, solo eliminamos de /admins) */
export async function removeAdmin(uid: string) {
  await deleteDoc(doc(db, 'admins', uid));
  // Si quieres, también podrías bajar el rol en /users/{uid} aquí.
}
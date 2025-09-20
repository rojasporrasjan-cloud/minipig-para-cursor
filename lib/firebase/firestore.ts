// lib/firebase/firestore.ts
import app from "./client";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export const db = getFirestore(app);

/**
 * Crea el documento de usuario en Firestore si no existe.
 * Guarda datos básicos. Se puede extender luego (rol, teléfono, etc.).
 */
export async function ensureUserDoc(params: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  providerId?: string | null;
}) {
  const { uid, displayName, email, photoURL = null, providerId = null } = params;

  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: displayName || "",
      email: email || "",
      photoURL,
      providerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    // (Opcional) Actualizar campos si vienen vacíos en Firestore.
    // await setDoc(ref, { updatedAt: serverTimestamp() }, { merge: true });
  }
}

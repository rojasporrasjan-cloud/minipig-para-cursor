// lib/firebase/users.ts
import type { User } from "firebase/auth";
import { db } from "./client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Crea/actualiza el perfil del usuario en Firestore.
 * - Crea el doc si no existe.
 * - Actualiza `lastLoginAt` en cada login.
 * - Solo establece `createdAt` si el doc no existía.
 */
export async function upsertUserProfile(user: User) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const base = {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    providerId: user.providerData?.[0]?.providerId ?? null,
    lastLoginAt: serverTimestamp(),
  } as const;

  if (snap.exists()) {
    // Actualiza sin tocar createdAt
    await setDoc(ref, base, { merge: true });
  } else {
    await setDoc(
      ref,
      {
        ...base,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}

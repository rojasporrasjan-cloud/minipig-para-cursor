'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
// --- CORRECCIÓN AQUÍ ---
// Apuntamos al nuevo archivo centralizado
import { auth } from '@/lib/firebase/client'; 
import { isAdmin, subscribeAdmins, AdminDoc } from '@/lib/admin';

export function useAdminGate() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState<boolean>(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const isAdminStatus = await isAdmin(u.uid);
        setAllowed(isAdminStatus);
      } else {
        setAllowed(false);
      }
      setLoading(false);
      setCheckingAdmin(false);
    });
    return () => unsub();
  }, []);

  return { user, loading: loading || checkingAdmin, allowed };
}

export function useAdminsList(enabled: boolean) {
  const [items, setItems] = useState<(AdminDoc & { uid: string })[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const unsub = subscribeAdmins((list) => {
      setItems(list);
      setReady(true);
    });
    return () => unsub?.();
  }, [enabled]);

  return { items, ready };
}
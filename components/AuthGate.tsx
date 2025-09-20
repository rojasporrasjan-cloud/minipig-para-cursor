// components/AuthGate.tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace(`/login?from=${encodeURIComponent(path)}`);
      } else {
        setUser(u);
        setReady(true);
      }
    });
    return () => unsub();
  }, [router, path]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 text-gray-600">
        <div className="flex items-center gap-3 text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          Cargando…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

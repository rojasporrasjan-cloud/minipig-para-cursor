// components/AdminGate.tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter, usePathname } from "next/navigation";
import { isAdmin } from "@/lib/admin";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setChecking(true);
      
      if (!u) {
        // No hay usuario autenticado - redirigir a login
        router.replace(`/login?from=${encodeURIComponent(path)}`);
        return;
      }

      // Verificar si el usuario es administrador
      try {
        const adminStatus = await isAdmin(u.uid);
        
        if (!adminStatus) {
          // Usuario autenticado pero no es admin - redirigir a página de acceso denegado
          router.replace('/admin/access-denied');
          return;
        }

        // Usuario es admin - permitir acceso
        setUser(u);
        setIsAdminUser(true);
        setReady(true);
      } catch (error) {
        console.error('Error verificando permisos de admin:', error);
        // En caso de error, redirigir por seguridad
        router.replace('/admin/access-denied');
      } finally {
        setChecking(false);
      }
    });

    return () => unsub();
  }, [router, path]);

  // Pantalla de carga mientras se verifica autenticación y permisos
  if (!ready || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-pink-light/30 via-brand-background to-white">
        <div className="text-center space-y-6">
          {/* Logo animado */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-pink to-brand-pink-dark flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <span className="text-3xl text-white">🐷</span>
          </div>
          
          {/* Indicador de carga */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-brand-dark font-semibold">Verificando permisos de administrador...</p>
            <p className="text-sm text-brand-text-muted">Solo administradores pueden acceder al panel</p>
          </div>
        </div>
      </div>
    );
  }

  // Solo renderizar children si el usuario es admin verificado
  return isAdminUser ? <>{children}</> : null;
}

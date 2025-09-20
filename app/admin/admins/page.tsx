// app/admin/admins/page.tsx
'use client';
import { useAdminGate, useAdminsList } from '@/hooks/useAdmins';
import AdminsTable from '@/components/admin/AdminsTable';

export default function AdminAdminsPage() {
  const { user, loading, allowed } = useAdminGate();
  const { items, ready } = useAdminsList(allowed);

  if (loading) return <div className="p-6">Cargando…</div>;
  if (!user) return <div className="p-6">Iniciá sesión para continuar.</div>;
  if (!allowed) return <div className="p-6">No tenés acceso a esta sección.</div>;

  return (
    <main className="space-y-8">
      {/* Header mejorado */}
      <header className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Gestión de Administradores
        </div>
        <div className="flex items-center justify-center gap-8">
          <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
          <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
            Panel de 
            <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Administradores</span>
          </h1>
          <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
        </div>
        <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
          Gestiona permisos y accesos de los administradores del sistema
        </p>
      </header>

      {/* Contenido */}
      {!ready ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-brand-text-muted font-medium">Cargando administradores...</p>
        </div>
      ) : (
        <div className="animate-fade-in-up">
          <AdminsTable currentUid={user.uid} items={items as any} />
        </div>
      )}
    </main>
  );
}

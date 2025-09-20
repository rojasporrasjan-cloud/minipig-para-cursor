// components/admin/AdminsTable.tsx
'use client';
import { useMemo, useState } from 'react';
import { addAdmin, removeAdmin, AdminRole } from '@/lib/admin'; // Corregido: admin en singular

type Item = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  role: AdminRole;
};

export default function AdminsTable({
  currentUid,
  items
}: { currentUid: string; items: Item[] }) {

  const [adding, setAdding] = useState(false);
  const [newUid, setNewUid] = useState('');
  const [role, setRole] = useState<AdminRole>('admin');
  const [error, setError] = useState<string | null>(null);
  const [busyUid, setBusyUid] = useState<string | null>(null);

  const totalAdmins = useMemo(
    () => items.filter(i => i.role === 'admin' || i.role === 'owner').length,
    [items]
  );

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
  }

  async function onAdd() {
    setError(null);
    const uid = newUid.trim();
    if (!uid) { setError('Ingresá un UID válido.'); return; }
    if (items.some(i => i.uid === uid)) {
      setError('Ese UID ya es admin.');
      return;
    }
    try {
      setAdding(true);
      // @ts-ignore
      await addAdmin(uid, role); // Se eliminó currentUid como primer argumento
      setNewUid('');
      setRole('admin');
    } catch (e: any) {
      setError(e?.message ?? 'Error al agregar admin.');
    } finally {
      setAdding(false);
    }
  }

  async function onRemove(uid: string) {
    setError(null);
    if (uid === currentUid) {
      setError('No podés quitarte a vos mismo.');
      return;
    }
    if (totalAdmins <= 1) {
      setError('No podés eliminar al último admin.');
      return;
    }
    const confirmMsg = `¿Seguro que querés quitar el admin con UID:\n${uid}?`;
    if (!confirm(confirmMsg)) return;

    try {
      setBusyUid(uid);
      await removeAdmin(uid); // Se eliminó currentUid como primer argumento
    } catch (e: any) {
      setError(e?.message ?? 'Error al quitar admin.');
    } finally {
      setBusyUid(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-3">Agregar administrador</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={newUid}
            onChange={e => setNewUid(e.target.value)}
            placeholder="UID del usuario"
            className="border rounded px-3 py-2"
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value as AdminRole)}
            className="border rounded px-3 py-2"
          >
            <option value="admin">admin</option>
            <option value="owner">owner</option>
          </select>
          <button
            onClick={onAdd}
            disabled={adding}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-4 py-2 disabled:opacity-60"
          >
            {adding ? 'Agregando…' : 'Agregar'}
          </button>
        </div>
        {error && <p className="text-red-600 mt-3">{error}</p>}
        <p className="text-xs text-gray-500 mt-2">
          * Debés pegar el UID del usuario (lo ves en Firebase Auth).
        </p>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3">UID</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Rol</th>
              <th className="text-right p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.uid} className="border-t">
                <td className="p-3">
                  <code className="bg-gray-100 rounded px-2 py-1">{it.uid}</code>
                  <button
                    onClick={() => copy(it.uid)}
                    className="ml-2 text-blue-600 hover:underline"
                    title="Copiar UID"
                  >
                    Copiar
                  </button>
                </td>
                <td className="p-3">{it.email ?? '—'}</td>
                <td className="p-3">{it.displayName ?? '—'}</td>
                <td className="p-3 font-medium">{it.role}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onRemove(it.uid)}
                    disabled={busyUid === it.uid}
                    className="text-red-600 hover:underline disabled:opacity-60"
                  >
                    {busyUid === it.uid ? 'Quitando…' : 'Quitar'}
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No hay administradores aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Total admins: {totalAdmins}
      </p>
    </div>
  );
}
// components/admin/Sidebar.tsx (ejemplo)
import Link from 'next/link';
export function AdminSidebar() {
  return (
    <nav className="space-y-1">
      <Link href="/admin" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
      <Link href="/admin/admins" className="block px-3 py-2 rounded hover:bg-gray-100">Administradores</Link>
      {/* más secciones: estadísticas, configuración, etc. */}
    </nav>
  );
}

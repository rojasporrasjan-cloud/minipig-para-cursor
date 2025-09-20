// app/admin/layout.tsx
"use client";

import "@/app/globals.css";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { Toaster } from 'react-hot-toast';
import { usePathname } from "next/navigation";
import AdminGate from "@/components/AdminGate";

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "🏠", color: "from-blue-400 to-blue-600" },
    { href: "/admin/pigs", label: "Cerditos", icon: "🐷", color: "from-pink-400 to-pink-600" },
    { href: "/admin/products", label: "Productos", icon: "🛍️", color: "from-purple-400 to-purple-600" },
    { href: "/admin/ventas", label: "Ventas", icon: "🛒", color: "from-green-400 to-green-600" },
    { href: "/admin/testimonials", label: "Historias Felices", icon: "❤️", color: "from-red-400 to-red-600" },
    { href: "/admin/finanzas", label: "Finanzas", icon: "💰", color: "from-yellow-400 to-yellow-600" },
    { href: "/admin/admins", label: "Admins", icon: "👥", color: "from-indigo-400 to-indigo-600" },
    { href: "/configuracion", label: "Configuración", icon: "⚙️", color: "from-gray-400 to-gray-600" },
  ];

  const isActive = (href: string) => pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <AdminGate>
      <div className="flex min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-pink-light/20">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-full flex-col bg-white/90 backdrop-blur-xl border-r border-brand-border shadow-2xl">
          {/* Header del sidebar */}
          <div className="relative p-6 border-b border-brand-border bg-gradient-to-r from-brand-pink-light/20 to-brand-pink/10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-brand-dark">
                  Panel de Control
                </h2>
                <p className="text-sm text-brand-text-muted font-medium">
                  Administración Mini Pigs
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-pink to-brand-pink-dark text-white text-2xl shadow-lg">
                🐽
              </div>
            </div>
            
            {/* Botón cerrar móvil */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 lg:hidden p-2 rounded-lg text-brand-text-muted hover:text-brand-dark hover:bg-brand-pink-light/20 transition-colors"
            >
              <CloseIcon />
            </button>
            
            {/* Decoración */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-pink/30 to-transparent" />
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group relative flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300
                    ${active 
                      ? 'bg-gradient-to-r from-brand-pink-light to-brand-pink text-brand-dark shadow-lg transform scale-105' 
                      : 'text-brand-text-muted hover:text-brand-dark hover:bg-brand-pink-light/30 hover:scale-105'
                    }
                  `}
                >
                  {/* Icono con gradiente */}
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-lg text-lg transition-all duration-300
                    ${active 
                      ? 'bg-white/80 shadow-md' 
                      : `bg-gradient-to-br ${item.color} text-white group-hover:scale-110`
                    }
                  `}>
                    {item.icon}
                  </div>
                  
                  <span className="flex-1 text-sm tracking-wide">{item.label}</span>
                  
                  {/* Indicador activo */}
                  {active && (
                    <div className="w-2 h-2 rounded-full bg-brand-pink-dark animate-pulse" />
                  )}
                  
                  {/* Efecto hover */}
                  <div className={`
                    absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300
                    ${item.color}
                  `} />
                </Link>
              );
            })}
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-brand-border bg-gradient-to-r from-brand-background/50 to-white/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-brand-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-pink to-brand-pink-dark flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-brand-dark truncate">Admin User</p>
                <p className="text-xs text-brand-text-muted">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 lg:ml-0">
        {/* Header móvil */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm border-b border-brand-border shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-brand-text-muted hover:text-brand-dark hover:bg-brand-pink-light/20 transition-colors"
          >
            <MenuIcon />
          </button>
          <h1 className="text-lg font-bold text-brand-dark">Panel de Control</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Contenido */}
        <div className="relative min-h-screen">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-brand-background/30 to-brand-pink-light/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(247,140,182,0.05),transparent)] opacity-60" />
          
          <div className="relative p-4 md:p-8">
            <Toaster 
              position="bottom-right"
              toastOptions={{
                className: "glass-effect-pink shadow-brand text-brand-dark font-medium",
                duration: 4000,
              }}
            />
            {children}
          </div>
        </div>
      </main>
    </div>
    </AdminGate>
  );
}
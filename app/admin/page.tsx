// app/admin/page.tsx
'use client';

import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Sale } from '@/lib/types/sale';
import { Pig } from '@/lib/types/pig';
import { formatCRC } from '@/lib/format';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


// --- Componente para las tarjetas de estadísticas mejoradas ---
const StatCard = ({ title, value, icon, href, color, delay = "0s" }: { 
  title: string, 
  value: string | number, 
  icon: React.ReactNode, 
  href: string,
  color: string,
  delay?: string
}) => (
  <Link 
    href={href} 
    className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6 animate-fade-in-up"
    style={{ animationDelay: delay }}
  >
    {/* Fondo decorativo */}
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
    
    <div className="relative flex items-center gap-4">
      {/* Icono con gradiente */}
      <div className={`flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        {icon}
      </div>
      
      <div className="flex-1">
        <p className="text-3xl font-black text-brand-dark group-hover:text-brand-pink-dark transition-colors duration-300">
          {value}
        </p>
        <h3 className="text-sm font-semibold text-brand-text-muted group-hover:text-brand-dark transition-colors duration-300 mt-1">
          {title}
        </h3>
      </div>
      
      {/* Flecha indicadora */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="h-5 w-5 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
    
    {/* Elementos decorativos */}
    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-pink opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
    <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-brand-pink-dark opacity-30 group-hover:opacity-80 transition-opacity duration-300" />
  </Link>
);

// --- Iconos para el dashboard mejorados ---
const ProductIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const PigIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const SaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;


export default function AdminDashboardPage() {
  const { items: products, loading: productsLoading } = useProducts();
  const [sales, setSales] = useState<Sale[]>([]);
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const salesQuery = query(collection(db, 'sales'), orderBy('saleDate', 'desc'), limit(5));
    const pigsQuery = query(collection(db, 'pigs'));

    const unsubSales = onSnapshot(salesQuery, (snapshot) => {
      setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale)));
      setLoading(productsLoading);
    });

    const unsubPigs = onSnapshot(pigsQuery, (snapshot) => {
      setPigs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pig)));
    });

    return () => {
      unsubSales();
      unsubPigs();
    };
  }, [productsLoading]);

  const pigsAvailable = pigs.filter(p => p.status === 'disponible').length;
  const lowStockProducts = products.filter(p => p.stock && p.stock > 0 && p.stock < 5);

  return (
    <div className="space-y-8">
        {/* Header mejorado */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            Panel de Administración
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
            Dashboard 
            <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Ejecutivo</span>
          </h1>
          <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
            Resumen completo del estado de tu plataforma Mini Pig
          </p>
        </header>

        {/* --- Sección de Estadísticas Mejoradas --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard 
            title="Productos en Tienda" 
            value={loading ? '...' : products.length} 
            icon={<ProductIcon />} 
            href="/admin/products"
            color="from-purple-400 to-purple-600"
            delay="0s"
          />
          <StatCard 
            title="Cerditos Disponibles" 
            value={loading ? '...' : pigsAvailable} 
            icon={<PigIcon />} 
            href="/admin/pigs"
            color="from-pink-400 to-pink-600"
            delay="0.1s"
          />
          <StatCard 
            title="Ventas Recientes" 
            value={loading ? '...' : sales.length} 
            icon={<SaleIcon />} 
            href="/admin/ventas"
            color="from-green-400 to-green-600"
            delay="0.2s"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- Columna de Ventas Recientes Mejorada --- */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-brand-dark">Últimas Ventas</h2>
            </div>
            
            <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg overflow-hidden">
              {sales.length > 0 ? (
                <ul className="divide-y divide-brand-border">
                  {sales.map((sale, index) => (
                    <li key={sale.id} className="p-6 hover:bg-brand-pink-light/10 transition-colors duration-300">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="font-bold text-brand-dark">{sale.customerName}</p>
                          <p className="text-sm text-brand-text-muted flex items-center gap-2">
                            <span>🐷</span>
                            {sale.pigName}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xl font-black text-brand-pink font-mono">{formatCRC(sale.price)}</p>
                          <p className="text-xs text-brand-text-muted font-medium">
                            {format(sale.saleDate.toDate(), 'dd MMM yyyy', { locale: es })}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-brand-text-muted font-medium">No hay ventas recientes</p>
                </div>
              )}
            </div>
          </div>

          {/* --- Columna de Bajo Stock Mejorada --- */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-brand-dark">Productos con Bajo Stock</h2>
            </div>
            
            <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg overflow-hidden">
              {lowStockProducts.length > 0 ? (
                <ul className="divide-y divide-brand-border">
                  {lowStockProducts.map((product, index) => (
                    <li key={product.id} className="p-6 hover:bg-amber-50/50 transition-colors duration-300">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="font-bold text-brand-dark">{product.name}</p>
                          <p className="text-sm text-amber-600 font-semibold flex items-center gap-2">
                            <span>⚠️</span>
                            ¡Solo quedan {product.stock} unidades!
                          </p>
                        </div>
                        <Link 
                          href={`/admin/products/edit/${product.id}`} 
                          className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-4 py-2 text-white text-sm font-semibold transition-all duration-300 hover:scale-105"
                        >
                          Gestionar
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-brand-text-muted font-medium">Todos los productos tienen stock suficiente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
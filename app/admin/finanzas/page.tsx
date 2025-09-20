// app/admin/finanzas/page.tsx
"use client";

import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Sale } from '@/lib/types/sale';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCRC } from '@/lib/format';
import IncomeChart from '@/components/admin/IncomeChart';
import CouponManager from '@/components/admin/CouponManager'; // <-- Importamos la nueva herramienta

const StatCard = ({ title, value, change, icon, color, delay = "0s" }: { 
  title: string, 
  value: string, 
  change?: string,
  icon: string,
  color: string,
  delay?: string
}) => (
  <div 
    className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6 animate-fade-in-up"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-lg`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-brand-dark group-hover:text-brand-pink-dark transition-colors">
        {title}
      </h3>
    </div>
    <p className="text-3xl font-black text-brand-pink mb-2">{value}</p>
    {change && <p className="text-sm text-brand-text-muted">{change}</p>}
    
    {/* Elementos decorativos */}
    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-pink opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
    <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-brand-pink-dark opacity-30 group-hover:opacity-80 transition-opacity duration-300" />
  </div>
);

export default function FinanzasPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'sales'), where('status', 'in', ['pagado', 'entregado']), orderBy('saleDate', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(salesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const financials = useMemo(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.price, 0);
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = sales
      .filter(sale => sale.saleDate.toDate() >= startOfMonth)
      .reduce((acc, sale) => acc + sale.price, 0);
    const monthlySalesCount = sales.filter(sale => sale.saleDate.toDate() >= startOfMonth).length;
    return { totalRevenue, monthlyRevenue, monthlySalesCount };
  }, [sales]);

  if (loading) {
    return <p className="p-8">Cargando datos financieros...</p>;
  }

  return (
    <div className="space-y-8">
        {/* Header mejorado */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            Dashboard Financiero
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
              Centro 
              <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Financiero</span>
            </h1>
            <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
          </div>
          <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
            Resumen visual de ingresos y rendimiento de tus ventas
          </p>
        </header>

        {/* Stats mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard 
            title="Ingresos Históricos" 
            value={formatCRC(financials.totalRevenue)}
            icon="💰"
            color="from-green-400 to-green-600"
            delay="0s"
          />
          <StatCard 
            title="Ingresos de este Mes" 
            value={formatCRC(financials.monthlyRevenue)} 
            change={`en ${format(new Date(), 'MMMM', { locale: es })}`}
            icon="📈"
            color="from-blue-400 to-blue-600"
            delay="0.1s"
          />
          <StatCard 
            title="Ventas de este Mes" 
            value={String(financials.monthlySalesCount)} 
            change={`en ${format(new Date(), 'MMMM', { locale: es })}`}
            icon="🛒"
            color="from-purple-400 to-purple-600"
            delay="0.2s"
          />
        </div>
        
        {/* Gestor de cupones mejorado */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CouponManager />
        </div>
        
        {/* Gráfico de ingresos */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <IncomeChart sales={sales} />
        </div>
      </div>
  );
}
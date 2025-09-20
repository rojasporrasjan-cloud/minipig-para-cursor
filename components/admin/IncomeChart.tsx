// components/admin/IncomeChart.tsx
'use client';

import { Sale } from '@/lib/types/sale';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCRC } from '@/lib/format';

interface IncomeChartProps {
  sales: Sale[];
}

export default function IncomeChart({ sales }: IncomeChartProps) {
  const data = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};

    // Agrupamos las ventas por mes
    sales.forEach(sale => {
      // Solo contamos las ventas completadas
      if (sale.status === 'pagado' || sale.status === 'entregado') {
        const month = format(sale.saleDate.toDate(), 'yyyy-MM');
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += sale.price;
      }
    });

    // Convertimos el objeto a un array y lo formateamos para el gráfico
    return Object.entries(monthlyData)
      .map(([month, total]) => ({
        name: format(new Date(month), 'MMM yyyy', { locale: es }),
        Ingresos: total,
      }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  }, [sales]);

  // Formateador para el eje Y (vertical)
  const formatYAxis = (tick: number) => {
    return formatCRC(tick);
  };
  
  // Formateador para el Tooltip (la caja que aparece al pasar el mouse)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-2 shadow-sm">
          <p className="font-bold">{label}</p>
          <p className="text-sm text-brand-pink">{`Ingresos: ${formatCRC(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card h-96 w-full p-4">
      <h3 className="mb-4 text-lg font-bold text-brand-dark">Ingresos Mensuales</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="#8D7B75" />
            <YAxis tickFormatter={formatYAxis} stroke="#8D7B75" />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FFDDEE80' }} />
            <Legend />
            <Bar dataKey="Ingresos" fill="#F78CB6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-brand-text-muted">
            <p>No hay suficientes datos de ventas para mostrar el gráfico.</p>
        </div>
      )}
    </div>
  );
}
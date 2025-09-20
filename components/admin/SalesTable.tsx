"use client";

import { useState } from 'react';
import { Sale, SaleStatus, saleStatuses } from '@/lib/types/sale';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

// --- ICONOS PARA LOS BOTONES ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

const statusColors: { [key in SaleStatus]: string } = {
  consulta: 'bg-blue-100 text-blue-800',
  reservado: 'bg-yellow-100 text-yellow-800',
  pagado: 'bg-green-100 text-green-800',
  entregado: 'bg-indigo-100 text-indigo-800',
  cancelado: 'bg-gray-200 text-gray-800',
};

const StatusBadge = ({ status }: { status: SaleStatus }) => (
  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default function SalesTable({ sales, onEdit, onDelete, isOwner }: { sales: Sale[], onEdit: (sale: Sale) => void, onDelete: (saleId: string) => void, isOwner: boolean }) {
  const [filter, setFilter] = useState<SaleStatus | 'todos'>('todos');

  const filteredSales = sales.filter(sale => 
    filter === 'todos' ? true : sale.status === filter
  );

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(amount);

  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg text-[#2B2A28]">Historial de Adopciones</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <button onClick={() => setFilter('todos')} className={`px-3 py-1 text-xs font-medium rounded-md transition ${filter === 'todos' ? 'bg-[#8B5E34] text-white shadow-sm' : 'bg-gray-200 hover:bg-gray-300'}`}>Todos</button>
          {saleStatuses.map(status => (
            <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1 text-xs font-medium rounded-md transition ${filter === status ? 'bg-[#8B5E34] text-white shadow-sm' : 'bg-gray-200 hover:bg-gray-300'}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Cliente</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Mini Pig</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Fecha</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Monto</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSales.map(sale => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{sale.customerName}</td>
                <td className="px-4 py-3 text-gray-600">{sale.pigName}</td>
                <td className="px-4 py-3 text-gray-600">{sale.saleDate?.toDate ? format(sale.saleDate.toDate(), 'dd MMM yyyy', { locale: es }) : 'Fecha no disp.'}</td>
                <td className="px-4 py-3 text-gray-800 font-mono">{formatCurrency(sale.price)}</td>
                <td className="px-4 py-3"><StatusBadge status={sale.status} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <button onClick={() => onEdit(sale)} className="flex items-center gap-1 font-medium text-pink-600 hover:text-pink-800 transition">
                      <EditIcon /> Editar
                    </button>
                    {isOwner && (
                      <button onClick={() => onDelete(sale.id!)} className="flex items-center gap-1 text-red-500 hover:text-red-700" title="Eliminar Venta">
                        <DeleteIcon/> Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSales.length === 0 && <p className="p-6 text-center text-gray-500">No hay ventas que coincidan con el filtro.</p>}
      </div>
    </div>
  );
}
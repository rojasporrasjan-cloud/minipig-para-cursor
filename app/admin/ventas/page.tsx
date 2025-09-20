"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore'; 
import { db } from '@/lib/firebase/client';
import { Sale } from '@/lib/types/sale';
import SalesTable from '@/components/admin/SalesTable';
import SalesModal from '@/components/admin/SalesModal';
import { addSale, updateSale, deleteSale } from '@/lib/firebase/sales';
import { useAdminGate } from '@/hooks/useAdmins';
import toast from 'react-hot-toast';

export default function VentasPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);
  const { user } = useAdminGate();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (user) {
      const checkRole = async () => {
        const adminRef = doc(db, 'admins', user.uid);
        const docSnap = await getDoc(adminRef);
        if (docSnap.exists() && docSnap.data().role === 'owner') {
          setIsOwner(true);
        }
      };
      checkRole();
    }
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, 'sales'), orderBy('saleDate', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
        setSales(salesData);
        setLoading(false);
      }, 
      (error) => {
        console.error("Error al cargar las ventas: ", error);
        toast.error("No se pudieron cargar las ventas. Revisa tus reglas de Firestore.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (sale: Sale | null = null) => {
    setSaleToEdit(sale);
    setIsModalOpen(true);
  };
  
  const handleSaveSale = async (saleData: Omit<Sale, 'id'>, saleId?: string) => {
    const promise = saleId ? updateSale(saleId, saleData) : addSale(saleData);
    toast.promise(promise, {
      loading: 'Guardando venta...',
      success: `Venta ${saleId ? 'actualizada' : 'creada'} con éxito.`,
      error: 'No se pudo guardar la venta.',
    });
  };

  const handleDeleteSale = async (saleId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta venta? Esta acción revertirá el estado del cerdito a 'disponible'.")) {
      const promise = deleteSale(saleId);
      toast.promise(promise, {
        loading: 'Eliminando venta...',
        success: 'Venta eliminada.',
        error: 'No se pudo eliminar la venta.',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10"><p>Cargando ventas...</p></div>;
  }

  return (
    <div className="space-y-8">
        {/* Header mejorado */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            Gestión de Ventas
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
              Centro de 
              <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Ventas</span>
            </h1>
            <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
          </div>
          <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
            Supervisa y administra todas las adopciones y transacciones
          </p>
          
          <button 
            onClick={() => handleOpenModal()} 
            className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-bold text-lg transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Registrar Nueva Venta
          </button>
        </header>

        {/* Stats de ventas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-lg text-white">💰</span>
            </div>
            <div className="text-2xl font-black text-brand-pink">{sales.length}</div>
            <div className="text-sm text-brand-text-muted font-medium">Total Ventas</div>
          </div>
          
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-lg text-white">📈</span>
            </div>
            <div className="text-2xl font-black text-brand-pink">
              {formatCRC(sales.reduce((acc, sale) => acc + sale.price, 0))}
            </div>
            <div className="text-sm text-brand-text-muted font-medium">Ingresos Totales</div>
          </div>
          
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-lg p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-lg text-white">🐷</span>
            </div>
            <div className="text-2xl font-black text-brand-pink">
              {sales.filter(s => s.status === 'entregado').length}
            </div>
            <div className="text-sm text-brand-text-muted font-medium">Mini Pigs Entregados</div>
          </div>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SalesTable sales={sales} onEdit={handleOpenModal} onDelete={handleDeleteSale} isOwner={isOwner} />
        </div>

        <SalesModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSale}
          saleToEdit={saleToEdit}
        />
      </div>
  );
}
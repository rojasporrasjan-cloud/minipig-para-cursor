"use client";

import { useEffect, useState, useMemo } from 'react';
import { Sale, SaleStatus, saleStatuses } from '@/lib/types/sale';
import { Pig } from '@/lib/types/pig';
// --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
import { collection, getDocs, query, where, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

type UserProfile = { uid: string; displayName: string; email: string; };

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Omit<Sale, 'id'>, saleId?: string) => Promise<void>;
  saleToEdit?: Sale | null;
}

const initialFormState = {
  pigId: '', customerName: '', customerPhone: '', customerEmail: '',
  price: 0, status: 'consulta' as SaleStatus, notes: '', customerId: ''
};

export default function SalesModal({ isOpen, onClose, onSave, saleToEdit }: SalesModalProps) {
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [formData, setFormData] = useState<any>(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        const pigsRef = collection(db, 'pigs');
        const availablePigsQuery = query(pigsRef, where('status', '==', 'disponible'));
        
        const [pigsSnapshot, usersSnapshot] = await Promise.all([
          getDocs(availablePigsQuery),
          getDocs(collection(db, 'users')),
        ]);
        
        let pigList = pigsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pig));
        
        // Si estamos editando una venta, nos aseguramos de que el cerdito de esa venta aparezca en la lista
        if (saleToEdit && !pigList.some(p => p.id === saleToEdit.pigId)) {
          const editedPigDoc = await getDoc(doc(db, 'pigs', saleToEdit.pigId));
          if (editedPigDoc.exists()) {
            pigList.unshift({ id: editedPigDoc.id, ...editedPigDoc.data() } as Pig);
          }
        }
        
        setPigs(pigList);
        setUsers(usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
      };
      fetchInitialData();
    }
  }, [isOpen, saleToEdit]);

  useEffect(() => {
    if (saleToEdit) {
      const customer = users.find(u => u.uid === saleToEdit.customerId);
      setUserSearch(customer ? `${customer.displayName} (${customer.email})` : '');
      setFormData({
        pigId: saleToEdit.pigId,
        customerName: saleToEdit.customerName,
        customerPhone: saleToEdit.customerPhone,
        customerEmail: saleToEdit.customerEmail || '',
        price: saleToEdit.price,
        status: saleToEdit.status,
        notes: saleToEdit.notes || '',
        customerId: saleToEdit.customerId || ''
      });
    } else {
      setFormData(initialFormState);
      setUserSearch('');
    }
  }, [saleToEdit, isOpen, users]);
  
  const handleUserSelect = (user: UserProfile) => {
    setUserSearch(`${user.displayName} (${user.email})`);
    setFormData({ ...formData, customerId: user.uid, customerName: user.displayName, customerEmail: user.email });
  };

  const filteredUsers = useMemo(() => 
    userSearch ? users.filter(u => 
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) || 
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    ) : [],
    [userSearch, users]
  );
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const pigName = pigs.find(p => p.id === formData.pigId)?.name || saleToEdit?.pigName || 'N/A';
    
    const saleData: Omit<Sale, 'id'> = {
        pigId: formData.pigId,
        pigName: pigName,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        customerId: formData.customerId,
        price: Number(formData.price),
        status: formData.status,
        notes: formData.notes,
        saleDate: saleToEdit?.saleDate || Timestamp.now(),
    };
    
    await onSave(saleData, saleToEdit?.id);
    setIsSaving(false);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#8B5E34] mb-6">{saleToEdit ? 'Editar Venta' : 'Registrar Venta'}</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-lg font-semibold text-gray-800">Cliente</legend>
            <div className="relative">
              <label>Buscar Cliente Registrado (Opcional)</label>
              <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Escribe para buscar..." className="mt-1 input-style" />
              {filteredUsers.length > 0 && userSearch && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {filteredUsers.map(user => (
                    <li key={user.uid} onClick={() => handleUserSelect(user)} className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100">
                      {user.displayName} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t pt-4 space-y-4">
              <p className="text-xs text-gray-500">O completa los datos para un cliente no registrado:</p>
              <div><label>Nombre del Cliente</label><input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="mt-1 input-style" required disabled={!!formData.customerId} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label>Teléfono</label><input type="tel" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="mt-1 input-style" required /></div>
                <div><label>Email</label><input type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="mt-1 input-style" disabled={!!formData.customerId} /></div>
              </div>
            </div>
          </fieldset>
          
          <fieldset className="border-t pt-6 space-y-4">
            <legend className="text-lg font-semibold text-gray-800">Detalles de la Adopción</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Mini Pig</label>
                  <select value={formData.pigId} onChange={e => setFormData({...formData, pigId: e.target.value})} className="mt-1 input-style" required>
                    <option value="">Seleccionar cerdito...</option>
                    {saleToEdit && <option value={saleToEdit.pigId}>{saleToEdit.pigName} (actual)</option>}
                    {pigs.map(pig => <option key={pig.id} value={pig.id!}>{pig.name}</option>)}
                  </select>
                </div>
                <div><label>Precio (₡)</label><input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="mt-1 input-style" required /></div>
              </div>
               <div>
                  <label>Estado de la Venta</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as SaleStatus})} className="mt-1 input-style" required>
                    {saleStatuses.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                  </select>
                </div>
                 <div><label>Notas Adicionales</label><textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="mt-1 input-style" rows={3}></textarea></div>
          </fieldset>
          
          <div className="mt-6 flex justify-end gap-3 border-t pt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={isSaving} className="btn-primary">{isSaving ? 'Guardando...' : 'Guardar Cambios'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
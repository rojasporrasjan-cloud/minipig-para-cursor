"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Link from "next/link";
import { Pig, PigStatus } from "@/lib/types/pig";
import { useAdminGate } from "@/hooks/useAdmins";
import { deletePigById } from "@/lib/firebase/pigs";
import toast from 'react-hot-toast'; // Importamos la librería de notificaciones

// Componente de insignia de estado (sin cambios)
const StatusBadge = ({ status }: { status?: PigStatus }) => {
    const statusStyles: { [key in PigStatus]: string } = {
        disponible: 'bg-green-100 text-green-800',
        reservado: 'bg-yellow-100 text-yellow-800',
        vendido: 'bg-indigo-100 text-indigo-800',
    };
    const text = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Desconocido';
    const style = status ? statusStyles[status] : 'bg-gray-200 text-gray-800';
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${style}`}>
            {text}
        </span>
    );
};

export default function AdminPigsPage() {
    const { loading: authLoading, allowed } = useAdminGate();
    const [pigs, setPigs] = useState<Pig[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !allowed) { router.push("/"); return; }
        if (allowed) {
            const unsub = onSnapshot(collection(db, "pigs"), (snapshot) => {
                const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Pig));
                setPigs(docs);
                setLoading(false);
            });
            return () => unsub();
        }
    }, [authLoading, allowed, router]);

    const toggleVisibility = async (pig: Pig) => {
        const newVisibility = pig.visibility === 'public' ? 'private' : 'public';
        const promise = updateDoc(doc(db, "pigs", pig.id!), { visibility: newVisibility });
        
        // Notificación optimista
        toast.promise(promise, {
           loading: 'Cambiando visibilidad...',
           success: `Ahora es ${newVisibility === 'public' ? 'Público' : 'Privado'}.`,
           error: 'No se pudo cambiar la visibilidad.',
        });
    };

    // --- FUNCIÓN DE ELIMINAR ACTUALIZADA ---
    const handleDelete = async (pigId: string) => {
        // Usamos una notificación toast para confirmar, en lugar de window.confirm
        toast((t) => (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium">¿Seguro que quieres eliminar este cerdito?</p>
            <p className="text-xs text-gray-500">Esta acción es irreversible.</p>
            <div className="flex gap-3 mt-2">
              <button
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded-md"
                onClick={() => {
                  const promise = deletePigById(pigId).then(() => toast.dismiss(t.id));
                  toast.promise(promise, {
                    loading: 'Eliminando...',
                    success: 'Cerdito eliminado.',
                    error: 'No se pudo eliminar.',
                  });
                }}
              >
                Sí, eliminar
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs py-1.5 px-3 rounded-md"
                onClick={() => toast.dismiss(t.id)}
              >
                Cancelar
              </button>
            </div>
          </div>
        ), {
          duration: 6000, // La notificación se queda más tiempo para dar chance de responder
        });
    };

    if (loading || authLoading) return <p className="p-8">Cargando cerditos...</p>;

    return (
        <div className="space-y-8">
                {/* Header mejorado */}
                <header className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark">
                        <span className="flex h-2 w-2 rounded-full bg-brand-pink animate-pulse"></span>
                        Gestión de Mini Pigs
                    </div>
                    <div className="flex items-center justify-center gap-8">
                        <div className="hidden md:block w-16 h-px bg-gradient-to-r from-transparent to-brand-pink/30" />
                        <h1 className="text-4xl md:text-5xl font-black text-brand-dark">
                            Nuestros 
                            <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> Cerditos</span>
                        </h1>
                        <div className="hidden md:block w-16 h-px bg-gradient-to-l from-transparent to-brand-pink/30" />
                    </div>
                    <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
                        Administra todos los mini pigs disponibles para adopción
                    </p>
                    
                    <Link 
                        href="/admin/pigs/new" 
                        className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-bold text-lg transition-all duration-300 shadow-button-primary hover:shadow-button-primary-hover hover:scale-105 active:scale-95"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Agregar Nuevo Cerdito
                    </Link>
                </header>

                {/* Tabla mejorada */}
                <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-brand-border shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gradient-to-r from-brand-pink-light/20 to-brand-pink/10">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold text-brand-dark">Nombre</th>
                                    <th className="px-6 py-4 text-left font-bold text-brand-dark">Estado</th>
                                    <th className="px-6 py-4 text-left font-bold text-brand-dark">Visibilidad</th>
                                    <th className="px-6 py-4 text-right font-bold text-brand-dark">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                                {pigs.length > 0 ? pigs.map((pig, index) => (
                                    <tr 
                                        key={pig.id} 
                                        className="hover:bg-brand-pink-light/10 transition-all duration-300 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-pink to-brand-pink-dark flex items-center justify-center text-white font-bold">
                                                    🐷
                                                </div>
                                                <div>
                                                    <p className="font-bold text-brand-dark">{pig.name}</p>
                                                    <p className="text-sm text-brand-text-muted">ID: {pig.id?.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={pig.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleVisibility(pig)} 
                                                className={`
                                                    relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 hover:scale-105
                                                    ${pig.visibility === 'public' 
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }
                                                `}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${pig.visibility === 'public' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                                {pig.visibility === 'public' ? 'PÚBLICO' : 'PRIVADO'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link 
                                                    href={`/admin/pigs/edit/${pig.id}`} 
                                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Editar
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(pig.id!)} 
                                                    className="inline-flex items-center gap-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
                                                    title="Eliminar Cerdito"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 rounded-full bg-brand-pink-light flex items-center justify-center mx-auto">
                                                    <span className="text-2xl">🐷</span>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-brand-dark">No hay cerditos registrados</p>
                                                    <p className="text-brand-text-muted">Comienza agregando tu primer mini pig</p>
                                                </div>
                                                <Link 
                                                    href="/admin/pigs/new"
                                                    className="inline-flex items-center gap-2 rounded-full bg-brand-pink hover:bg-brand-pink-dark px-6 py-3 text-white font-semibold transition-all duration-300 hover:scale-105"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Agregar Primer Cerdito
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stats adicionales */}
                {pigs.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <div className="space-y-2">
                            <div className="text-2xl md:text-3xl font-bold text-brand-pink">{pigs.length}</div>
                            <div className="text-sm text-brand-text-muted font-medium">Total Cerditos</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-2xl md:text-3xl font-bold text-brand-pink">
                                {pigs.filter(p => p.status === 'disponible').length}
                            </div>
                            <div className="text-sm text-brand-text-muted font-medium">Disponibles</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-2xl md:text-3xl font-bold text-brand-pink">
                                {pigs.filter(p => p.visibility === 'public').length}
                            </div>
                            <div className="text-sm text-brand-text-muted font-medium">Públicos</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-2xl md:text-3xl font-bold text-brand-pink">
                                {pigs.filter(p => p.status === 'vendido').length}
                            </div>
                            <div className="text-sm text-brand-text-muted font-medium">Adoptados</div>
                        </div>
                    </div>
                )}
            </div>
    );
}
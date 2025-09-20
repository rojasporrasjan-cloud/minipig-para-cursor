// app/adopciones/[id]/ExpedienteDigital.tsx
import { Pig } from '@/lib/types/pig';
import { Sale } from '@/lib/types/sale';
import IdCard from '@/components/expediente/IdCard';
import Timeline from '@/components/expediente/Timeline';
import WelcomeChecklist from '@/components/expediente/WelcomeChecklist';
import WelcomeCouponCard from '@/components/expediente/WelcomeCouponCard'; // <-- 1. Importamos la tarjeta de regalo
import Image from 'next/image';

// El componente ahora recibe tanto el 'pig' como la 'sale'
export default function ExpedienteDigital({ pig, sale }: { pig: Pig, sale: Sale }) {
  return (
    <div className="space-y-8">
      {/* Tarjeta de Identidad del Cerdito */}
      <IdCard pig={pig} />
      
      {/* --- 2. AQUÍ MOSTRAMOS LA NUEVA TARJETA DE REGALO --- */}
      {/* Solo se mostrará si la venta tiene un cupón activo */}
      <WelcomeCouponCard sale={sale} />

      {/* Guía Interactiva de Primeros Pasos */}
      <WelcomeChecklist pig={pig} />

      {/* Línea de Tiempo de Hitos */}
      <Timeline pig={pig} />
      
      {/* Galería de Fotos */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-brand-dark mb-4">Galería de Recuerdos</h3>
        {pig.images && pig.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pig.images.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-sm">
                <Image src={url} alt={`Recuerdo de ${pig.name} ${index + 1}`} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay fotos adicionales en la galería.</p>
        )}
      </div>
    </div>
  );
}
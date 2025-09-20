// components/expediente/IdCard.tsx
import { Pig } from '@/lib/types/pig';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';

interface IdCardProps {
  pig: Pig;
}

export default function IdCard({ pig }: IdCardProps) {
  // --- RE-HIDRATACIÓN ---
  // Convertimos el string de vuelta a un objeto Date antes de usarlo.
  const birthDate = pig.birthDate ? new Date(pig.birthDate as any) : null;

  return (
    <div className="card p-6 bg-gradient-to-br from-rose-50 to-pink-100 shadow-xl border-pink-200">
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="relative flex-shrink-0 h-32 w-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
          <Image
            src={pig.images?.[0] || '/og-pig.jpg'}
            alt={`Foto de ${pig.name}`}
            fill
            className="object-cover"
            sizes="128px"
            style={{ position: 'absolute' }}
          />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-pink-500">Expediente de Adopción</p>
          <h2 className="text-4xl font-extrabold text-brand-dark mt-1">{pig.name}</h2>
          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-brand-text-muted">
            {birthDate && (
              <span>Nacimiento: <strong>{format(birthDate, "d 'de' MMMM, yyyy", { locale: es })}</strong></span>
            )}
            <span>Sexo: <strong>{pig.sex}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
// components/PigCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Pig } from '@/lib/types/pig';
import { formatCRC } from '@/lib/format';

// Iconos pequeños
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);
const SoldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2H10z" clipRule="evenodd" />
  </svg>
);
const MaleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);
const FemaleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

interface PigWithDetails extends Pig {
  images?: string[];
  sex?: 'macho' | 'hembra' | string;
}

const displayAge = (ageMonths?: number): string | null => {
  if (typeof ageMonths !== 'number') return null;
  if (ageMonths <= 0) return "Recién nacido";
  if (ageMonths === 1) return "1 mes";
  if (ageMonths < 12) return `${ageMonths} meses`;
  const years = Math.floor(ageMonths / 12);
  const rest = ageMonths % 12;
  return rest ? `${years}a ${rest}m` : `${years} años`;
};

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  // Badge visual consistente (glass + ring suave)
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold
        backdrop-blur-md border border-white/30 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default function PigCard({ pig }: { pig: PigWithDetails }) {
  const imageUrl = pig.images && pig.images.length > 0 ? pig.images[0] : null;
  const age = displayAge(pig.ageMonths);
  const sex = pig.sex;

  return (
    <Link
      href={`/adopciones/${pig.id}`}
      className="block group/card"
      aria-label={`Ver detalles de ${pig.name}`}
      title={`Ver detalles de ${pig.name}`}
    >
      <article className="card overflow-hidden h-full flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-1">
        {/* Imagen */}
        <div className="relative aspect-[4/3] bg-brand-pink-light/40">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={pig.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover/card:scale-105"
              priority={false}
              style={{ position: 'absolute' }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl">🐷</div>
          )}

          {/* Gradiente inferior para legibilidad si fuera necesario */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/10 to-transparent" />

          {/* Badges (status, sexo, edad) */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            {pig.status === 'vendido' && (
              <Badge className="bg-gray-800/80 text-white">
                <SoldIcon /> Vendido
              </Badge>
            )}
            {pig.status === 'reservado' && (
              <Badge className="bg-yellow-600/85 text-white">
                <ClockIcon /> Reservado
              </Badge>
            )}
            {(!pig.status || pig.status === 'disponible') && (
              <Badge className="bg-green-600/85 text-white">
                <CheckIcon /> Disponible
              </Badge>
            )}

            {sex === 'macho' && (
              <Badge className="bg-blue-500/85 text-white">
                <MaleIcon /> Macho
              </Badge>
            )}
            {sex === 'hembra' && (
              <Badge className="bg-pink-500/85 text-white">
                <FemaleIcon /> Hembra
              </Badge>
            )}
            {age && (
              <Badge className="bg-black/60 text-white">
                <CalendarIcon /> {age}
              </Badge>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 flex-grow flex flex-col bg-white">
          <h3 className="text-lg font-bold text-brand-dark">{pig.name}</h3>

          <p className="mt-0.5 text-base font-semibold text-brand-accent">
            {formatCRC(pig.priceCRC)}
          </p>

          <p className="text-sm text-brand-text-muted mt-2 line-clamp-2 flex-grow">
            {pig.description || 'Este cerdito aún no tiene descripción.'}
          </p>

          <div className="mt-4">
            <span className="font-semibold text-brand-pink group-hover/card:underline underline-offset-4">
              Ver detalles →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

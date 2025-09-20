'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pig } from '@/lib/types/pig';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// --- Funciones auxiliares para mostrar los datos del cerdito ---
function optimizeCloudinary(url: string, width = 1200): string {
    if (typeof url !== 'string' || !url.includes("res.cloudinary.com/")) return url;
    const marker = "/upload/";
    const idx = url.indexOf(marker);
    if (idx === -1) return url;
    const before = url.slice(0, idx + marker.length);
    const after = url.slice(idx + marker.length);
    if (/f_auto|q_auto|w_\d+/.test(after)) return url;
    return `${before}f_auto,q_auto,w_${width}/${after}`;
}
  
function findAllImageUrls(pig: Pig): string[] {
    if (!pig) return [];
    return pig.images || [];
}
  
function displaySex(raw: any): string | null {
    if (!raw) return null;
    const s = String(raw).toLowerCase();
    if (["hembra", "female", "f"].includes(s)) return "Hembra";
    if (["macho", "male", "m"].includes(s)) return "Macho";
    return null;
}
  
function displayAge(pig: Pig): string | null {
    if (typeof pig?.ageMonths === "number") {
      const m = pig.ageMonths;
      if (m <= 0) return "Recién nacido";
      if (m === 1) return "1 mes";
      if (m < 12) return `${m} meses`;
      const years = Math.floor(m / 12);
      const rest = m % 12;
      return rest ? `${years}a ${rest}m` : `${years} años`;
    }
    return null;
}

const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(amount);

export default function PigDetailClient({ pig }: { pig: Pig }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const images = useMemo(() => findAllImageUrls(pig), [pig]);

  // --- CORRECCIÓN CLAVE ---
  // Esta lógica ahora es segura, incluso si el array 'images' está vacío.
  const cover = images.length > 0 ? (images[activeIdx] || images[0]) : null;

  const sex = displaySex(pig.sex);
  const age = displayAge(pig);
  const isPublic = pig.visibility === 'public';
  const finalPrice = pig.priceCRC || 0;
  const whatsappNumber = "50672752645";
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, me interesa ${pig.name ?? "un mini pig"} 🐷`)}`;

  return (
    <article className="grid gap-8 md:grid-cols-2">
      {/* Sección de la Galería de Imágenes */}
      <div className="rounded-2xl border border-brand-border bg-white shadow-lg overflow-hidden">
        <div className="relative w-full overflow-hidden bg-pink-50 aspect-[16/10]">
          {/* --- LÓGICA MEJORADA --- */}
          {/* Si hay una imagen de portada, la mostramos. Si no, mostramos un placeholder. */}
          {cover ? (
             <Image
              src={optimizeCloudinary(cover, 1200)} alt={pig.name ?? "Mini pig"} fill priority
              sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl text-pink-300">🐷</div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {isPublic && <span className="rounded-md bg-green-700/90 px-2 py-1 text-xs font-semibold text-white shadow">Disponible</span>}
            {sex && <span className="rounded-md bg-brand-pink px-2 py-1 text-xs font-medium text-white shadow">{sex}</span>}
            {age && <span className="rounded-md bg-brand-dark/80 px-2 py-1 text-xs font-medium text-white shadow">{age}</span>}
          </div>
        </div>
        {images.length > 1 && (
          <div className="p-3 flex gap-3 overflow-x-auto">
            {images.map((src, i) => (
              <button key={src + i} onClick={() => setActiveIdx(i)}
                className={`relative shrink-0 rounded-lg overflow-hidden border-2 w-24 h-[72px] ${i === activeIdx ? "border-brand-pink" : "border-brand-border hover:border-gray-400"}`}
                aria-label={`Imagen ${i + 1}`} type="button">
                <Image src={optimizeCloudinary(src, 320)} alt={`Mini pig ${i + 1}`} fill sizes="96px" style={{ objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Sección de Detalles */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-brand-dark">{pig.name ?? "Mini pig"}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-brand-text-muted">
          {pig.createdAt && <span>Publicado: {format(new Date(pig.createdAt as any), "d 'de' MMMM, yyyy", { locale: es })}</span>}
          {finalPrice > 0 && (
            <span className="text-xl font-bold text-brand-dark">
              {formatCurrency(finalPrice)}
            </span>
          )}
        </div>
        {pig.description && <p className="mt-4 text-base leading-relaxed text-brand-dark">{pig.description}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
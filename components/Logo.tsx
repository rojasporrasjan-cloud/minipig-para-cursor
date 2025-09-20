import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ width = 120, height = 40, className = '' }: LogoProps) {
  return (
    // Usa la URL de tu logo aquí. Si lo subiste a public/, será /logo.png
    gs://yo-tengo-un-mini-pig-cr.firebasestorage.app/WhatsApp Image 2025-09-18 at 12.29.25 PM.jpeg
    <Image 
      src="/logo.png" 
      alt="Logo Yo Tengo un Mini Pig Costa Rica" 
      width={width} 
      height={height} 
      className={`h-auto ${className}`} // h-auto mantiene la proporción
      priority // Carga con alta prioridad para el logo principal
    />
  );
}
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-20 text-center">
      <div className="rounded-xl border border-rose-200/60 bg-white/80 p-8 shadow-lg">
        <span className="text-8xl" role="img" aria-label="Cerdito confundido">🧐</span>
        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-rose-950">
          ¡Ups! Página No Encontrada
        </h1>
        <p className="mt-3 text-lg text-[#5B524C]">
          Parece que el cerdito que buscabas se ha escondido. No hemos podido encontrar la página que buscas.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center rounded-md bg-rose-900 text-white px-6 py-3 text-sm font-medium shadow-lg shadow-rose-900/20 hover:bg-rose-800 transition-transform hover:scale-105"
          >
            Volver a la Página de Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
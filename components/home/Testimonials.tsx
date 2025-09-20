// components/home/Testimonials.tsx
import Link from 'next/link'; // <-- ¡SOLUCIÓN! Se añade esta línea para importar el componente Link.

function Stars() {
  return (
    <div className="flex items-center" aria-label="Valoración 5 de 5">
      <span aria-hidden className="text-brand-pink">★</span>
      <span aria-hidden className="text-brand-pink">★</span>
      <span aria-hidden className="text-brand-pink">★</span>
      <span aria-hidden className="text-brand-pink">★</span>
      <span aria-hidden className="text-brand-pink">★</span>
    </div>
  );
}

export default function Testimonials() {
  const items = [
    { name: 'Ana G.', text: 'La asesoría fue increíble. Nuestro mini pig es súper dócil y limpio.' },
    { name: 'Luis R.', text: 'Nos guiaron en todo. Se nota el amor con que crían los cerditos.' },
    { name: 'María P.', text: 'Experiencia 10/10. Acompañamiento antes y después de adoptar.' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Lo que dicen las familias</h2>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {items.map((t) => (
          <figure
            key={t.name}
            className="rounded-xl border border-brand-border bg-white/90 p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="text-sm"><Stars /></div>
            <blockquote className="mt-2 text-brand-text-muted">{t.text}</blockquote>
            <figcaption className="mt-3 text-sm font-semibold text-brand-dark">— {t.name}</figcaption>
          </figure>
        ))}
      </div>
      
      {/* --- NUEVO BOTÓN AÑADIDO AQUÍ --- */}
      <div className="mt-8 text-center">
        <Link href="/familias-felices" className="btn-pig">
          Ver todas las historias ❤️
        </Link>
      </div>
    </section>
  );
}
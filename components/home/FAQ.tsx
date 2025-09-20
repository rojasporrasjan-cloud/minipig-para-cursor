// components/home/FAQ.tsx
export default function FAQ() {
  const faqs = [
    { q: '¿Un mini pig es para cualquier hogar?', a: 'Recomendamos espacio, rutina y compromiso. Te guiamos para evaluar si es para ti.' },
    { q: '¿Qué comen?', a: 'Balanceado específico, verduras y frutas permitidas. Te damos una guía detallada.' },
    { q: '¿Son limpios?', a: 'Sí, pueden aprender a hacer en un lugar designado y son muy ordenados.' },
  ];

  return (
    // --- AÑADIMOS EL ID AQUÍ ---
    <section id="faq" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-rose-950">Preguntas frecuentes</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {faqs.map((f) => (
          <div key={f.q} className="card p-5">
            <h3 className="font-semibold text-rose-950">{f.q}</h3>
            <p className="mt-1 text-sm text-[#6B625B]">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
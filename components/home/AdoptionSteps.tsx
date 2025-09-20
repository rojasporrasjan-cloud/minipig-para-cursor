// components/home/AdoptionSteps.tsx

export default function AdoptionSteps() {
  const steps = [
    { n: '1', title: 'Contáctanos', desc: 'Conversemos por WhatsApp para ayudarte a elegir.' },
    { n: '2', title: 'Conócelo', desc: 'Te mostramos fotos/videos y resolvemos tus dudas.' },
    { n: '3', title: 'Checklist', desc: 'Revisamos espacio, alimentación y compromiso.' },
    { n: '4', title: 'Adopción', desc: 'Entregamos con guía, y seguimos acompañándote.' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">¿Cómo funciona?</h2>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, idx) => (
          <div
            key={s.n}
            className="relative rounded-xl border border-brand-border bg-white/90 p-5 shadow-sm transition-transform hover:-translate-y-1"
          >
            {/* número en píldora mini pig */}
            <div className="h-8 w-8 rounded-full bg-brand-pink text-white flex items-center justify-center text-sm font-semibold">
              {s.n}
            </div>

            <h3 className="mt-3 font-semibold text-brand-dark">{s.title}</h3>
            <p className="mt-1 text-sm text-brand-text-muted">{s.desc}</p>

            {/* conector sutil en layouts de 4 columnas (desktop) */}
            {idx < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="hidden lg:block absolute top-9 -right-3 h-0.5 w-6 bg-brand-border"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

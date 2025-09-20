export default function ValueProps() {
  const items = [
    { 
      icon: '🩺', 
      title: 'Salud primero', 
      desc: 'Controles veterinarios, desparasitación y guía de vacunas completa.',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    { 
      icon: '🤝', 
      title: 'Acompañamiento', 
      desc: 'Te asesoramos en alimentación, espacio y socialización continua.',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      icon: '🏆', 
      title: 'Selección ética', 
      desc: 'Bienestar animal y crianza responsable con los más altos estándares.',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    { 
      icon: '🎓', 
      title: 'Educación', 
      desc: 'Guías detalladas de entrenamiento y comportamiento animal.',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-background/30 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(247,140,182,0.05),transparent)] opacity-60" />
      
      <div className="relative mx-auto max-w-7xl px-4">
        {/* Encabezado mejorado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink-light/50 border border-brand-pink-light px-4 py-2 text-sm font-medium text-brand-dark mb-6">
            <span className="flex h-2 w-2 rounded-full bg-brand-pink animate-pulse"></span>
            Por qué elegirnos
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Compromiso con la 
            <span className="bg-gradient-to-r from-brand-pink to-brand-pink-dark bg-clip-text text-transparent"> excelencia</span>
          </h2>
          <p className="text-xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
            Cada mini pig recibe cuidados especializados desde el primer día, 
            garantizando su bienestar y preparación para una vida feliz contigo.
          </p>
        </div>

        {/* Cards mejoradas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div 
              key={item.title} 
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card principal */}
              <div className={`relative h-full rounded-2xl ${item.bgColor} ${item.borderColor} border-2 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm`}>
                
                {/* Icono con gradiente */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white text-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {item.icon}
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40`} />
                </div>

                {/* Contenido */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-pink-dark transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-brand-text-muted leading-relaxed group-hover:text-brand-dark transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-pink opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-brand-pink-dark opacity-30 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-brand-pink-light/0 group-hover:to-brand-pink-light/10 transition-all duration-500" />
              </div>

              {/* Background blur effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 blur-xl transition-all duration-500 -z-10`} />
            </div>
          ))}
        </div>

        {/* Stats adicionales */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-brand-pink">120+</div>
            <div className="text-sm text-brand-text-muted font-medium">Adopciones exitosas</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-brand-pink">5★</div>
            <div className="text-sm text-brand-text-muted font-medium">Calificación promedio</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-brand-pink">24/7</div>
            <div className="text-sm text-brand-text-muted font-medium">Soporte disponible</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-brand-pink">100%</div>
            <div className="text-sm text-brand-text-muted font-medium">Garantía de salud</div>
          </div>
        </div>
      </div>
    </section>
  );
}
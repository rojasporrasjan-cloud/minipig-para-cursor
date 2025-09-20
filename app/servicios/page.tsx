export default function ServiciosPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Servicios</h1>
      <p className="text-gray-600 mb-6">
        Acompañamiento en adopción, recomendaciones de cuidado y más. Próximamente detalles completos.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-1">Asesoría de cuidado</h3>
          <p className="text-sm text-gray-600">Alimentación, higiene y espacio ideal para tu mini pig.</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-1">Kit inicial (opcional)</h3>
          <p className="text-sm text-gray-600">Recomendaciones para comenzar con los básicos.</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold mb-1">Soporte post-adopción</h3>
          <p className="text-sm text-gray-600">Resolvemos dudas y te acompañamos en el proceso.</p>
        </div>
      </div>
    </main>
  );
}

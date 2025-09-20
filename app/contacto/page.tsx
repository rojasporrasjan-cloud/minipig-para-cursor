export default function ContactoPage() {
  const wa = "https://wa.me/50672752645?text=" + encodeURIComponent(
    "Hola 👋, me interesa adoptar un mini pig 🐷. ¿Podemos hablar?"
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-gray-600 mb-6">
        Escríbenos por WhatsApp para consultas y reservas.
      </p>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-wa px-4 py-2 rounded-md"
      >
        Abrir WhatsApp
      </a>
    </main>
  );
}

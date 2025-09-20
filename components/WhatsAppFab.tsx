// components/WhatsAppFab.tsx
"use client";

export default function WhatsAppFab() {
  const href =
    "https://wa.me/50672752645?text=" +
    encodeURIComponent("Hola 👋, me interesa adoptar un mini pig 🐷. ¿Podemos hablar?");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // La clase "md:hidden" asegura que solo se vea en pantallas pequeñas (móviles)
      className="fixed z-50 bottom-4 right-4 md:hidden inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#128C7E] transition-transform hover:scale-110"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.433-9.89-9.889-9.89-5.452 0-9.887 4.428-9.888 9.891.001 2.245.651 4.288 1.745 5.947l-1.023 3.75zM8.348 7.028c-.14-.307-.282-.313-.422-.319-.122-.005-.262-.004-.403-.004-.16 0-.41.064-.61.318-.215.272-.84.828-.84 2.01c0 1.181.865 2.323.985 2.472.121.149 1.694 2.69 4.105 3.633 2.115.823 2.513.738 2.96.69.462-.049 1.433-.584 1.638-1.15.204-.565.204-1.043.144-1.164-.06-.121-.217-.194-.465-.345-.247-.152-1.475-.73-1.704-.81-.229-.08-.396-.121-.562.121-.167.243-.633.725-.775.873-.142.148-.282.166-.52.045-.24-.121-1.004-.367-1.907-1.177-.702-.624-1.164-1.39-1.297-1.634-.133-.243-.014-.375.108-.498.107-.108.24-.282.36-.422.12-.142.164-.243.243-.403.08-.16.04-.307-.02-.422-.06-.122-.562-1.347-.765-1.844z"/>
      </svg>
    </a>
  );
}
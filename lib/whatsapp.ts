// lib/whatsapp.ts
const WHATSAPP_NUMBER = '50672752645';

type BuildWaOptions = {
  context?: string;   // dónde se clickeó (home-hero, home-pigs, etc.)
  message?: string;   // mensaje base
};

export function buildWhatsAppLink(options: BuildWaOptions = {}) {
  const { context = 'home', message = 'Hola 👋, me interesa adoptar un mini pig 🐷. ¿Podemos hablar?' } = options;

  // Nota: wa.me solo soporta el parámetro 'text'. Los UTM no los procesa WhatsApp.
  // Para analítica, usamos evento GA4 y añadimos una referencia en el mensaje.
  const text = encodeURIComponent(`${message}\n\nRef: ${context}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// Helper: dispara un evento GA4 si está disponible en el cliente
export function trackWhatsAppClick(context: string) {
  try {
    // @ts-ignore
    window?.gtag?.('event', 'whatsapp_click', {
      event_category: 'engagement',
      event_label: context,
      value: 1,
    });
  } catch {
    // no-op
  }
}

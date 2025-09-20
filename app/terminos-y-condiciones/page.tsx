// app/terminos-y-condiciones/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Yo Tengo un Mini Pig CR',
  description: 'Lee nuestros términos y condiciones de uso para el sitio web y la tienda.',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article className="prose lg:prose-lg prose-rose">
        <header className="mb-8 border-b pb-4">
          <h1 className="!mb-2">Términos y Condiciones de Uso</h1>
          <p className="text-gray-500">Última actualización: 17 de septiembre de 2025</p>
        </header>

        <p>
          Bienvenido a "Yo Tengo un Mini Pig Costa Rica". Al acceder y utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones.
        </p>

        <h2>1. Uso del Sitio</h2>
        <p>
          Este sitio web está destinado a proporcionar información sobre la adopción de mini pigs y la venta de productos relacionados. Te comprometes a utilizar este sitio únicamente con fines lícitos.
        </p>

        <h2>2. Cuentas de Usuario</h2>
        <p>
          Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Aceptas la responsabilidad de todas las actividades que ocurran bajo tu cuenta.
        </p>

        <h2>3. Proceso de Compra y Adopción</h2>
        <p>
          Todas las transacciones, ya sean de productos de la tienda o procesos de adopción, se coordinan y finalizan a través de canales de comunicación directos como WhatsApp. El carrito de compras es una herramienta para facilitar la cotización y el pedido, pero no constituye un contrato de venta final.
        </p>
        
        <h2>4. Propiedad Intelectual</h2>
        <p>
          El contenido de este sitio, incluyendo textos, gráficos y logos, es propiedad de "Yo Tengo un Mini Pig Costa Rica" y está protegido por las leyes de derechos de autor.
        </p>

        <h2>5. Limitación de Responsabilidad</h2>
        <p>
          No seremos responsables por ningún daño directo o indirecto que resulte del uso de este sitio web. La información se proporciona "tal cual" sin garantías de ningún tipo.
        </p>
      </article>
    </main>
  );
}
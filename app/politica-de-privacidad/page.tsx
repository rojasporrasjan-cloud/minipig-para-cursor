// app/politica-de-privacidad/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Yo Tengo un Mini Pig CR',
  description: 'Conoce cómo manejamos tus datos y protegemos tu privacidad en nuestro sitio.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article className="prose lg:prose-lg prose-rose">
        <header className="mb-8 border-b pb-4">
          <h1 className="!mb-2">Política de Privacidad</h1>
          <p className="text-gray-500">Última actualización: 17 de septiembre de 2025</p>
        </header>

        <p>
          En "Yo Tengo un Mini Pig Costa Rica", tu privacidad es de suma importancia para nosotros. Esta política de privacidad explica qué datos personales recopilamos y cómo los usamos.
        </p>

        <h2>1. Información que Recopilamos</h2>
        <p>
          Recopilamos información que nos proporcionas directamente al crear una cuenta, como:
        </p>
        <ul>
          <li><strong>Nombre para mostrar:</strong> Para personalizar tu experiencia.</li>
          <li><strong>Correo electrónico:</strong> Para la autenticación de tu cuenta y comunicación.</li>
        </ul>
        <p>
          Utilizamos Firebase Authentication para gestionar las cuentas de usuario de forma segura.
        </p>

        <h2>2. Cómo Usamos tu Información</h2>
        <p>
          Usamos la información que recopilamos para:
        </p>
        <ul>
          <li>Proveer, operar y mantener nuestro sitio web.</li>
          <li>Mejorar, personalizar y expandir nuestro sitio web.</li>
          <li>Entender y analizar cómo usas nuestro sitio web.</li>
          <li>Comunicarnos contigo para servicio al cliente, para proporcionarte actualizaciones y otra información relacionada con el sitio.</li>
        </ul>

        <h2>3. Uso de Cookies y Almacenamiento Local</h2>
        <p>
          Nuestro sitio utiliza almacenamiento local (`localStorage`) para funcionalidades como el carrito de compras y la lista de favoritos. Estos datos se almacenan únicamente en tu navegador y no se transmiten a nuestros servidores, excepto durante el proceso de una consulta o compra.
        </p>
        
        <h2>4. Seguridad de tus Datos</h2>
        <p>
          La seguridad de tus datos es una prioridad. Utilizamos los servicios de Firebase de Google, que implementan medidas de seguridad robustas para proteger tu información. Sin embargo, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro.
        </p>

        <h2>5. Cambios a esta Política de Privacidad</h2>
        <p>
          Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos de cualquier cambio publicando la nueva Política de Privacidad en esta página.
        </p>
      </article>
    </main>
  );
}
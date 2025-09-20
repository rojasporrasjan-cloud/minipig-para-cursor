// app/api/send-welcome-email/route.ts
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/components';

const resend = new Resend(process.env.RESEND_API_KEY);
const LOGO_URL = "https://res.cloudinary.com/db4ld8cy2/image/upload/v1758221449/t0soj7ltzftnp5i9mszr.jpg";

export async function POST(req: NextRequest) {
  try {
    const { email, customerName, pigName, expedienteUrl, couponCode } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email del destinatario es requerido.' }, { status: 400 });
    }

    const emailHtml = render(WelcomeEmail({
        customerName,
        pigName,
        expedienteUrl,
        couponCode,
        logoUrl: LOGO_URL,
    }));

    const { data, error } = await resend.emails.send({
      from: 'Yo Tengo un Mini Pig <onboarding@resend.dev>', // Usando el dominio de prueba de Resend
      to: [email],
      subject: `¡Bienvenido a la familia! Conoce el expediente de ${pigName}`,
      html: emailHtml,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email enviado con éxito!', data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  render,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  customerName: string;
  pigName: string;
  expedienteUrl: string;
  couponCode: string;
  logoUrl: string;
}

export const WelcomeEmail = ({
  customerName,
  pigName,
  expedienteUrl,
  couponCode,
  logoUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>¡Bienvenido a la familia! Accede al expediente de {pigName}.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={logoUrl}
          width="150"
          height="45"
          alt="Yo Tengo un Mini Pig Logo"
          style={logo}
        />
        <Text style={paragraph}>Hola {customerName},</Text>
        <Text style={paragraph}>
          ¡Felicidades y bienvenido a la familia de Yo Tengo un Mini Pig! Estamos increíblemente felices de que {pigName} haya encontrado un hogar tan maravilloso contigo.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={expedienteUrl}>
            Acceder al Expediente Digital de {pigName}
          </Button>
        </Section>
        <Text style={paragraph}>
          Para ayudarte a empezar, hemos preparado un regalo especial para ti. Usa el siguiente código para obtener un **15% de descuento** en tu primera compra de alimentos o accesorios en nuestra tienda.
        </Text>
        <Section style={couponContainer}>
          <Text style={couponCodeText}>{couponCode}</Text>
        </Section>
        <Text style={paragraph}>
          Gracias por darle a {pigName} una vida llena de amor.
          <br />
          El equipo de Yo Tengo un Mini Pig
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Costa Rica</Text>
      </Container>
    </Body>
  </Html>
);

// --- Estilos para el Email ---
const main = { backgroundColor: '#fff9f5', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',};
const container = { margin: '0 auto', padding: '20px 0 48px', };
const logo = { margin: '0 auto', };
const paragraph = { fontSize: '16px', lineHeight: '26px', color: '#4F342B', };
const btnContainer = { textAlign: 'center' as const, margin: '24px 0', };
const button = { backgroundColor: '#f78cb6', borderRadius: '9999px', color: '#fff', fontSize: '15px', textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '12px 20px', };
const couponContainer = { border: '2px dashed #f78cb6', borderRadius: '8px', padding: '20px', textAlign: 'center' as const, margin: '24px 0', backgroundColor: '#fffdeee1' };
const couponCodeText = { fontSize: '24px', fontWeight: 'bold' as const, color: '#e0729a', margin: 0, };
const hr = { borderColor: '#fbe9e4', margin: '20px 0', };
const footer = { color: '#8d7b75', fontSize: '12px', };

export default WelcomeEmail;
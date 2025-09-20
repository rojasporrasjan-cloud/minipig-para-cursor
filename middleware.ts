// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas del admin
  if (pathname.startsWith('/admin') && pathname !== '/admin/access-denied') {
    // El middleware no puede verificar Firebase Auth directamente,
    // pero podemos agregar headers de seguridad adicionales
    const response = NextResponse.next();
    
    // Agregar headers de seguridad para rutas admin
    response.headers.set('X-Admin-Route', 'true');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de request excepto las que empiecen con:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

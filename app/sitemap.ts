// app/sitemap.ts
import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase/client'; // Usamos nuestra db de compatibilidad
import { Product } from '@/lib/types';
import { Pig } from '@/lib/types/pig';
import { getSortedPostsData } from '@/lib/blog';

// URL base de tu sitio. ¡Asegúrate de cambiarla cuando lo despliegues!
const URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Páginas estáticas
  const staticRoutes = [
    '/',
    '/adopciones',
    '/tienda',
    '/blog',
    '/favoritos',
    '/contacto',
    '/politica-de-privacidad',
    '/terminos-y-condiciones',
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date(),
  }));

  // 2. Artículos del blog dinámicos
  const posts = getSortedPostsData();
  const blogRoutes = posts.map((post) => ({
    url: `${URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  // 3. Cerditos en adopción dinámicos
  const pigsSnapshot = await db.collection('pigs').where('visibility', '==', 'public').get();
  const pigRoutes = pigsSnapshot.docs.map((doc) => {
    const data = doc.data() as Pig;
    return {
      url: `${URL}/adopciones/${doc.id}`,
      lastModified: data.updatedAt ? data.updatedAt.toDate() : new Date(),
    };
  });

  // 4. Productos de la tienda dinámicos
  const productsSnapshot = await db.collection('products').get();
  const productRoutes = productsSnapshot.docs.map((doc) => {
    const data = doc.data() as Product;
    return {
      url: `${URL}/tienda/${doc.id}`,
      lastModified: data.updatedAt ? data.updatedAt.toDate() : new Date(),
    };
  });

  return [...staticRoutes, ...blogRoutes, ...pigRoutes, ...productRoutes];
}
// app/blog/[slug]/page.tsx
import { getPostData, getSortedPostsData } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata } from 'next';

// --- Generación de metadatos dinámicos para SEO ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await getPostData(params.slug);
    return {
      title: `${post.title} | Blog Mini Pig CR`,
      description: post.excerpt,
    };
  } catch (error) {
    return {
      title: "Artículo no encontrado",
      description: "Este artículo no existe o fue movido."
    }
  }
}

// --- Generar rutas estáticas en el momento de la construcción ---
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = await getPostData(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <article className="prose lg:prose-lg prose-rose">
        <header className="mb-8 border-b pb-4">
          <h1 className="!mb-2 text-4xl font-extrabold tracking-tight text-rose-950">{post.title}</h1>
          <p className="text-gray-500">
            Publicado el {format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: es })}
          </p>
        </header>
        {/* Aquí es donde el contenido del markdown se renderizaría como HTML */}
        {/* Por ahora, lo mostramos como texto simple */}
        <div className="whitespace-pre-wrap">{post.content}</div>
      </article>
    </main>
  );
}
// components/home/BlogPreview.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getSortedPostsData } from '@/lib/blog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type BlogPost = {
  slug: string;
  title: string;
  date: string | number | Date;
  excerpt?: string;
  cover?: string;       // ← si tu dato se llama distinto, cámbialo aquí
  category?: string;    // ← opcional: mostraré la primera categoría
};

export default function BlogPreview() {
  const latestPosts = (getSortedPostsData().slice(0, 3) as BlogPost[]) || [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Aprende en nuestro blog</h2>
          <p className="mt-1 text-brand-text-muted">
            Consejos de cuidados, alimentación y convivencia con tu Mini Pig.
          </p>
        </div>

        <Link
          href="/blog"
          className="hidden sm:inline-flex btn-outline-pig px-4 py-2 text-sm"
          aria-label="Ver todos los artículos del blog"
          title="Ver todos los artículos"
        >
          Ver todos los artículos
        </Link>
      </div>

      {/* Grid de posts */}
      {latestPosts.length > 0 ? (
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {latestPosts.map((post) => {
            const dateLabel = format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: es });
            const hasCover = Boolean(post.cover);

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
                aria-label={`Leer: ${post.title}`}
                title={post.title}
              >
                <article className="card h-full overflow-hidden p-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Cover 16:9 */}
                  <div className="relative aspect-video w-full bg-brand-pink-light/40">
                    {/* Renderizo cover si existe; si no, placeholder elegante */}
                    {hasCover ? (
                      <Image
                        src={post.cover as string}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-pink-light to-white">
                        <span className="text-4xl">✍️</span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-brand-text-muted">
                      <time dateTime={new Date(post.date).toISOString()}>{dateLabel}</time>
                      {/* Píldora de categoría si existe */}
                      <span className="mx-1">•</span>
                      <span className="inline-flex items-center rounded-full border border-brand-border bg-white/80 px-2 py-0.5">
                        {post.category || "Mini Pig 101"}
                      </span>
                    </div>

                    <h3 className="mt-2 font-bold text-lg text-brand-dark transition-colors group-hover:text-brand-pink">
                      {post.title}
                    </h3>

                    <p className="mt-2 text-sm text-brand-text-muted line-clamp-3">
                      {post.excerpt || "Consejos y guías prácticas para una convivencia feliz con tu mini pig."}
                    </p>

                    <span className="mt-4 block text-sm font-semibold text-brand-pink">
                      Leer artículo →
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        // Empty state elegante
        <div className="mt-6 text-center py-10 rounded-lg bg-white/80 border border-brand-border">
          <p className="text-brand-dark font-medium">Aún no hay artículos en el blog</p>
          <p className="text-sm text-brand-text-muted mt-1">Estamos preparando contenido útil para ti. 🐷</p>
          <div className="mt-4">
            <Link href="/blog" className="btn-outline-pig">
              Ir al blog
            </Link>
          </div>
        </div>
      )}

      {/* CTA móvil */}
      <div className="mt-6 sm:hidden text-center">
        <Link href="/blog" className="btn-outline-pig inline-flex">
          Ver todos los artículos
        </Link>
      </div>
    </section>
  );
}

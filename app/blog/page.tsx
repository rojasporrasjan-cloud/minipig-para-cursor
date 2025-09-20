// app/blog/page.tsx
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata = {
  title: 'Blog | Yo Tengo un Mini Pig CR',
  description: 'Consejos, historias y guías de cuidado para dueños de mini pigs en Costa Rica.',
};

export default function BlogPage() {
  const allPosts = getSortedPostsData();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-rose-950">Nuestro Blog</h1>
        <p className="mt-3 text-lg text-[#5B524C]">
          Consejos, historias y guías de cuidado para tu mini pig.
        </p>
      </header>

      <div className="space-y-8">
        {allPosts.map(({ slug, date, title, excerpt }) => (
          <Link href={`/blog/${slug}`} key={slug} className="block group">
            <article className="card p-6 flex flex-col md:flex-row gap-6 items-center transition-shadow duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="flex-shrink-0 text-center">
                <p className="text-4xl font-extrabold text-rose-300">{format(new Date(date), 'dd', { locale: es })}</p>
                <p className="text-sm text-rose-500 -mt-1">{format(new Date(date), 'MMM', { locale: es })}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-rose-950 group-hover:text-rose-600 transition-colors">{title}</h2>
                <p className="mt-2 text-md text-[#6B625B]">{excerpt}</p>
                 <span className="mt-4 inline-block text-sm font-semibold text-rose-600 group-hover:underline">
                  Leer más →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
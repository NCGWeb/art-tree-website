import Image from 'next/image';
import type { Metadata } from 'next';
import ExhibitionsList from '@/components/ExhibitionsList';
import { getPageContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const ex = await getPageContent('exhibitions');
  return { title: ex.meta.title, description: ex.meta.description };
}

export default async function ExhibitionsPage() {
  const ex = await getPageContent('exhibitions');

  return (
    <main id="main">
      <section className="bg-gradient-to-b from-cream to-[#EFE8D8] px-5 py-12">
        <div className="mx-auto max-w-site">
          <div className="text-[0.7rem] font-semibold uppercase tracking-[2px] text-terracotta">{ex.hero.eyebrow}</div>
          <h1 className="mt-2 max-w-xl font-head text-3xl leading-tight text-headline-green sm:text-4xl">{ex.hero.heading}</h1>
          <div className="my-4 h-0.5 w-11 bg-gold" />
          <p className="max-w-[46ch] text-sm leading-relaxed text-[#4a473c]">{ex.hero.lead}</p>
          <blockquote className="mt-5 max-w-md font-head text-lg italic leading-snug text-headline-green">
            {ex.hero.quote}
          </blockquote>
        </div>
      </section>

      {/* Current / latest show, pinned */}
      <section className="bg-cream py-6">
        <div className="mx-auto max-w-site px-5">
          <article className="grid grid-cols-1 gap-6 rounded-lg border border-gold/40 bg-cream-deep p-5 sm:grid-cols-[110px_280px_1fr] sm:items-start">
            <div className="flex gap-2 sm:block">
              <div className="font-head text-3xl leading-none text-headline-green">{ex.current.day}</div>
              <div className="text-sm text-ink">{ex.current.month}</div>
              <div className="font-head text-lg text-terracotta">{ex.current.year}</div>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded shadow-md">
              <Image src={ex.current.image} alt={ex.current.alt} fill priority className="object-cover" sizes="280px" />
            </div>
            <div>
              <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-tan">{ex.current.category}</div>
              <h3 className="mb-1.5 font-head text-2xl text-headline-green">{ex.current.title}</h3>
              <div className="mb-2 text-xs text-[#6a674f]">{ex.current.meta}</div>
              {ex.current.paragraphs.map((p, i) => (
                <p key={i} className="mb-2 text-sm leading-relaxed text-[#4a473c]">{p}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <ExhibitionsList events={ex.events} dateOptions={ex.filters.dates} typeOptions={ex.filters.types} />
    </main>
  );
}

import Image from 'next/image';
import type { Metadata } from 'next';
import ExhibitionsList from '@/components/ExhibitionsList';
import Reveal from '@/components/Reveal';
import { getPageContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const ex = await getPageContent('exhibitions');
  return { title: ex.meta.title, description: ex.meta.description };
}

export default async function ExhibitionsPage() {
  const ex = await getPageContent('exhibitions');

  return (
    <main id="main">
      {/* HERO — full-bleed landscape illustration as a true background
          (edge-to-edge, both mobile and desktop), text left with a
          left-to-right scrim for contrast. Height is driven by the text
          content's own padding (py-14 .. lg:py-20 + an lg min-height cap),
          not by the image's intrinsic aspect ratio, so it can never balloon
          at wide desktop widths the way an aspect-ratio-driven hero would. */}
      <section className="relative overflow-hidden">
        <Image
          src={ex.hero.image}
          alt=""
          aria-hidden="true"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-site px-5 py-14 sm:py-16 md:py-20 lg:flex lg:min-h-[420px] lg:items-center">
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">{ex.hero.eyebrow}</div>
            <h1 className="mt-2 max-w-xl font-head text-3xl leading-tight text-white sm:text-4xl">{ex.hero.heading}</h1>
            <div className="my-4 h-0.5 w-12 bg-gold" />
            <p className="max-w-[46ch] text-sm leading-relaxed text-white/90">{ex.hero.lead}</p>
            <blockquote className="mt-5 max-w-md font-head text-lg italic leading-snug text-white">
              {ex.hero.quote}
            </blockquote>
          </div>
        </div>
      </section>

      {/* Current / latest show, pinned */}
      <Reveal as="section" className="bg-cream py-6">
        <div className="mx-auto max-w-site px-5">
          <article className="card-hover grid grid-cols-1 gap-6 rounded-lg border border-gold/40 bg-cream-deep p-5 sm:grid-cols-[110px_280px_1fr] sm:items-start">
            <div className="flex gap-2 sm:block">
              <div className="font-head text-3xl leading-none text-headline-green">{ex.current.day}</div>
              <div className="text-sm text-ink">{ex.current.month}</div>
              <div className="font-head text-lg text-terracotta">{ex.current.year}</div>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded shadow-md">
              <Image src={ex.current.image} alt={ex.current.alt} fill priority quality={90} className="object-cover" sizes="280px" />
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-tan">{ex.current.category}</div>
              <h3 className="mb-1.5 font-head text-2xl text-headline-green">{ex.current.title}</h3>
              <div className="mb-2 text-xs text-muted-soft">{ex.current.meta}</div>
              {ex.current.paragraphs.map((p, i) => (
                <p key={i} className="mb-2 text-sm leading-relaxed text-muted">{p}</p>
              ))}
            </div>
          </article>
        </div>
      </Reveal>

      <ExhibitionsList events={ex.events} dateOptions={ex.filters.dates} typeOptions={ex.filters.types} />
    </main>
  );
}

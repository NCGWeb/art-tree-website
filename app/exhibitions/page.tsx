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

      <ExhibitionsList events={ex.events} dateOptions={ex.filters.dates} typeOptions={ex.filters.types} />
    </main>
  );
}

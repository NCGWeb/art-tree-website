import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import GalleryFan from '@/components/GalleryFan';
import Reveal from '@/components/Reveal';
import { getPageContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const g = await getPageContent('gallery');
  return { title: g.meta.title, description: g.meta.description };
}

export default async function GalleryPage() {
  const g = await getPageContent('gallery');

  return (
    <main id="main">
      {/* HERO — left-aligned text with a decorative illustrated branch
          bleeding off the top-right corner, per the client's reference
          mockup (previously this was centered with no decoration). */}
      <section className="relative overflow-hidden bg-cream px-5 pb-6 pt-10 sm:pt-12">
        {g.hero.birdImage && (
          <div className="pointer-events-none absolute -right-4 -top-4 h-36 w-40 opacity-60 sm:h-56 sm:w-64 sm:opacity-100 md:-right-8 md:-top-8 md:h-72 md:w-80 lg:h-80 lg:w-[22rem]">
            <Image src={g.hero.birdImage} alt="" aria-hidden="true" fill priority quality={90} className="object-cover object-right-top" sizes="352px" />
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-site">
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{g.hero.eyebrow}</div>
            <h1 className="mt-2 font-head text-3xl leading-tight text-headline-green sm:text-4xl md:text-[2.5rem]">{g.hero.heading}</h1>
            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-muted">{g.hero.lead}</p>
            <a
              href="#g-collection"
              className="mt-5 inline-flex items-center gap-2 border border-headline-green px-5 py-3 text-xs uppercase tracking-widest text-headline-green transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-headline-green hover:text-white"
            >
              {g.hero.exploreLabel} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <GalleryFan items={g.carousel.items} />
      </section>

      <Reveal as="section" id="g-collection" className="bg-[#F6F1E4] py-12 sm:py-14">
        <div className="mx-auto grid max-w-site grid-cols-1 items-center gap-8 px-5 md:grid-cols-[1.1fr_0.6fr_auto_1fr]">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{g.collection.eyebrow}</div>
            <h2 className="mb-2 font-head text-2xl leading-tight text-headline-green sm:text-3xl">{g.collection.heading}</h2>
            <div className="mb-4 h-0.5 w-12 bg-gold" />
            <p className="mb-5 text-sm leading-relaxed text-muted">{g.collection.paragraph}</p>
            <Link
              href={g.collection.ctaHref}
              className="inline-flex items-center gap-2 border border-headline-green px-5 py-3 text-xs uppercase tracking-widest text-headline-green transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-headline-green hover:text-white"
            >
              {g.collection.ctaLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="relative mx-auto hidden h-56 w-40 md:block">
            {g.collection.decorImage && (
              <Image src={g.collection.decorImage} alt="" fill aria-hidden="true" quality={90} className="object-contain" sizes="160px" />
            )}
          </div>

          {/* Thin vertical divider between the decorative plant and the
              pull-quote, matching the mockup. */}
          <div className="mx-auto hidden h-40 w-px bg-headline-green/15 md:block" />

          <div>
            <blockquote className="font-head text-xl italic leading-snug text-headline-green">{g.collection.quote}</blockquote>
            <div className="mt-4 h-0.5 w-12 bg-gold" />
          </div>
        </div>
      </Reveal>

      <section className="bg-[#2e3a24] py-12 text-[#f3efe6] sm:py-14">
        <div className="mx-auto max-w-site px-5">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{g.featured.eyebrow}</div>
              <h2 className="mt-1 font-head text-2xl text-white sm:text-3xl">{g.featured.heading}</h2>
            </div>
            <Link href={g.featured.viewAllHref} className="border-b border-transparent pb-0.5 text-xs uppercase tracking-widest text-gold transition-colors duration-300 ease-out hover:border-white hover:text-white">
              {g.featured.viewAllLabel} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {g.featured.items.map((item, i) => (
              <Reveal as="figure" key={i} delay={Math.min(i, 4) * 70} className="group">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded shadow-md transition-shadow duration-300 ease-out group-hover:shadow-xl">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    quality={90}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </div>
                <figcaption className="pt-3">
                  <h3 className="font-head text-base text-white">{item.title}</h3>
                  <div className="text-xs text-gold">{item.form}</div>
                  <div className="text-xs text-white/60">{item.region}</div>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

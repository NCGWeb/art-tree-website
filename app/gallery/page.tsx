import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import GalleryFan from '@/components/GalleryFan';
import LotusQuoteBanner from '@/components/LotusQuoteBanner';
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
      {/* HERO — the branch/bird illustration is a modest corner accent in
          the reference design (roughly a quarter of the hero's width), not
          a full-bleed background. fill+object-cover across the whole
          section was scaling it up to cover the entire hero, which is what
          made it look oversized — a fixed, capped box with object-contain
          instead, anchored to the top-right corner. */}
      <Reveal as="section" className="relative overflow-hidden bg-cream px-5 pb-6 pt-10 sm:pt-12">
        {g.hero.birdImage && (
          <div
            className="pointer-events-none absolute right-0 top-0 aspect-[800/906] w-[96px] sm:w-[230px] md:w-[320px] lg:w-[400px]"
            aria-hidden="true"
          >
            <Image src={g.hero.birdImage} alt="" fill quality={90} className="object-contain object-right-top" sizes="(min-width: 1024px) 400px, (min-width: 768px) 320px, 230px" />
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-site">
          <div className="max-w-xl pr-14 sm:pr-0">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">{g.hero.eyebrow}</div>
            <div className="mt-2 h-0.5 w-10 bg-gold" />
            <h1 className="mt-4 font-head text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">{g.hero.heading}</h1>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-muted sm:text-base">{g.hero.lead}</p>
            <a
              href="#g-collection"
              className="mt-5 inline-flex items-center gap-2 border border-headline-green px-5 py-2.5 text-xs uppercase tracking-widest text-headline-green transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-headline-green hover:text-white"
            >
              {g.hero.exploreLabel} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <GalleryFan items={g.carousel.items} />
      </Reveal>

      <Reveal as="section" id="g-collection" className="relative overflow-hidden bg-[#F6F1E4] pt-10 sm:pt-12">
        <div className="mx-auto grid max-w-site grid-cols-1 items-center gap-8 px-5 pb-10 sm:pb-12 md:grid-cols-[1.2fr_0.55fr_auto_1fr] md:gap-6 md:pb-0">
          <div className="md:pb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">{g.collection.eyebrow}</div>
            <div className="mb-4 mt-2 h-0.5 w-10 bg-gold" />
            <h2 className="mb-3 font-head text-3xl leading-[1.1] text-ink sm:text-4xl lg:text-[2.75rem]">{g.collection.heading}</h2>
            <p className="mb-5 max-w-[44ch] text-sm leading-relaxed text-muted">{g.collection.paragraph}</p>
            <Link
              href={g.collection.ctaHref}
              className="inline-flex items-center gap-2 border border-headline-green px-5 py-2.5 text-xs uppercase tracking-widest text-headline-green transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-headline-green hover:text-white"
            >
              {g.collection.ctaLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Background-free plant cutout; the stem runs down to the edge of the
              section below. */}
          <div className="relative mx-auto hidden aspect-[470/856] w-[150px] self-end md:block lg:w-[200px]">
            <Image src={g.collection.decorImage} alt="" fill aria-hidden="true" quality={90} className="object-contain object-bottom" sizes="200px" />
          </div>

          <div className="mx-auto h-px w-24 bg-headline-green/15 md:h-48 md:w-px" />

          <div className="md:pb-12">
            <blockquote className="font-head text-2xl italic leading-snug text-headline-green lg:text-3xl">{g.collection.quote}</blockquote>
            <div className="mt-4 h-0.5 w-12 bg-gold" />
          </div>
        </div>
      </Reveal>

      <section className="bg-[#2e3a24] py-10 text-[#f3efe6] sm:py-12">
        <div className="mx-auto max-w-site px-5">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gold">{g.featured.eyebrow} <span aria-hidden="true">❧</span></div>
              <h2 className="mt-2 font-head text-3xl text-white sm:text-5xl">{g.featured.heading}</h2>
            </div>
            <Link href={g.featured.viewAllHref} className="border-b border-transparent pb-0.5 text-xs uppercase tracking-widest text-gold transition-colors duration-300 ease-out hover:border-white hover:text-white">
              {g.featured.viewAllLabel} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {g.featured.items.map((item, i) => (
              <Reveal as="figure" key={i} delay={Math.min(i, 4) * 70} className="group">
                <div className="relative aspect-[7/9] w-full overflow-hidden rounded-md border border-gold/40 bg-black/25 shadow-md transition-shadow duration-300 ease-out group-hover:shadow-xl">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    quality={95}
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 700px, 100vw"
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

      {/* Content already had quoteBanner; LotusQuoteBanner already existed
          as a component (its own doc comment says it's meant to close out
          Gallery and Contact) but no page actually rendered it. */}
      <LotusQuoteBanner quote={g.quoteBanner} />
    </main>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Modal from '@/components/Modal';
import Reveal from '@/components/Reveal';
import { ICONS, StarIcon, PeopleIcon, BuildingIcon } from '@/components/icons';
import { getPageContent } from '@/lib/content';

const STAT_ICONS = [StarIcon, PeopleIcon, BuildingIcon];

const LEAF_POSITIONS: Record<string, { top: string; left: string; width: string; height: string; label: string; href: string }> = {
  about: { top: '14%', left: '60%', width: '12%', height: '17%', label: 'About Us', href: '/about' },
  artforms: { top: '32%', left: '65%', width: '13%', height: '17%', label: 'Art Forms', href: '/artforms' },
  events: { top: '46%', left: '77%', width: '13%', height: '17%', label: 'Events', href: '/exhibitions' },
  media: { top: '55%', left: '58%', width: '14%', height: '16%', label: 'Media', href: '/media' },
  gallery: { top: '70%', left: '72%', width: '13%', height: '17%', label: 'Gallery', href: '/gallery' },
  contact: { top: '81%', left: '61%', width: '13%', height: '14%', label: 'Contact Us', href: '/contact' },
};

export async function generateMetadata(): Promise<Metadata> {
  const home = await getPageContent('home');
  return { title: home.meta.title, description: home.meta.description };
}

export default async function HomePage() {
  const home = await getPageContent('home');

  return (
    <main id="main">
      <h1 className="sr-only">{home.hero.srHeading}</h1>

      {/* HERO */}
      <section className="relative" aria-label="Introduction">
        {/* The hero artwork is a single flattened 1600x885 (~16:9) image with
            the "Stories you can touch" copy and leaf-nav icons baked in, so
            unlike a plain photo it can't be cropped on the sides without
            losing content. Always rendered at its native aspect ratio, full
            viewport width, at every breakpoint — no height cap — so
            object-cover never has a mismatched box to crop. */}
        <div className="hero-wrap relative aspect-[1600/885] w-full">
          <Image
            src={home.hero.image}
            alt={home.hero.alt}
            fill
            priority
            quality={90}
            className="object-cover object-top"
            sizes="100vw"
          />
          {Object.entries(LEAF_POSITIONS).map(([key, pos]) => (
            <Link
              key={key}
              href={pos.href}
              aria-label={pos.label}
              title={pos.label}
              className="absolute rounded-full outline-offset-2 transition-colors duration-300 ease-out hover:bg-white/10 focus-visible:bg-white/10"
              style={{ top: pos.top, left: pos.left, width: pos.width, height: pos.height }}
            />
          ))}
        </div>
      </section>

      {/* RECORD — same pattern as the About/Art Forms heroes: box ratio
          matches the artwork's own 1955:803 ratio exactly so it's never
          cropped, text overlaid on top via absolute positioning (so it
          doesn't affect the box's height) at every breakpoint — no
          mobile/desktop split, image and text both always visible, same
          row, as asked. */}
      <Reveal as="section" className="relative overflow-hidden border-t border-black/5 bg-cream/88">
        <div className="relative w-full aspect-[1955/803]">
          <Image src={home.record.image} alt={home.record.alt} fill quality={90} className="object-cover object-left-top" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/50 to-cream/92" />
          <div className="absolute inset-0 z-10 flex items-center justify-end px-5 lg:pr-10 xl:pr-16">
            <div className="max-w-xl">
              <h2 className="font-head text-lg leading-tight text-headline-green sm:text-2xl lg:text-3xl">{home.record.heading}</h2>
              <div className="my-2 h-0.5 w-10 bg-gold sm:my-3.5 sm:w-12" />
              <p className="hidden max-w-[48ch] text-sm leading-relaxed text-muted sm:block">{home.record.paragraph}</p>
              <div className="mt-2 sm:mt-3.5">
                <Modal title={home.record.heading} paragraphs={home.record.modalParagraphs} buttonLabel={home.record.buttonLabel} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* STATS — a visually distinct band (warmer gold tone + vertical
          dividers) whose border runs along the same edge as its own
          background, rather than a separate inset box, so the two align. */}
      <section className="border-y border-gold/40 bg-[#EFE1BD] py-12 sm:py-16" aria-label="Art Tree in numbers">
        <div className="mx-auto max-w-site px-5">
          <div className="grid grid-cols-1 divide-y divide-gold/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {home.stats.map((s, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length];
              return (
                <Reveal as="div" key={i} delay={i * 90} className="py-5 text-center sm:py-0">
                  <Icon className="mx-auto mb-3 h-9 w-9 stroke-terracotta" />
                  <div className="font-head text-3xl font-bold text-ink">{s.number}</div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wide">{s.label}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted-soft">{s.sub}</div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CANVAS / STORY */}
      <Reveal as="section" className="bg-cream/88 py-10 sm:py-12">
        {/* Image bleeds to the viewport's left edge (no mx-auto/px wrapper
            on this row) and keeps the artwork's own native ratio instead of
            being force-cropped to aspect-[4/3], matching the design's
            compact, edge-anchored treatment. Only the text column gets
            page-gutter padding. */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="relative aspect-[1610/975] w-full overflow-hidden">
            <Image src={home.canvas.image} alt={home.canvas.alt} fill quality={90} className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div className="px-5 md:pl-0">
            <h2 className="mb-2 font-head text-2xl leading-tight text-headline-green sm:text-3xl">{home.canvas.heading}</h2>
            <div className="mb-3.5 h-0.5 w-12 bg-gold" />
            {home.canvas.paragraphs.map((p, i) => (
              <p key={i} className="mb-2.5 max-w-[46ch] text-sm leading-relaxed text-muted">{p}</p>
            ))}
            <Modal title={home.canvas.heading} paragraphs={home.canvas.modalParagraphs} buttonLabel={home.canvas.buttonLabel} />
          </div>
        </div>
      </Reveal>

      {/* WHAT WE DO */}
      <Reveal as="section" className="bg-cream/88 py-14 text-center sm:py-16">
        <div className="mx-auto max-w-site px-5">
          <div className="mb-10 flex items-center justify-center gap-5 text-olive">
            <span aria-hidden="true">⟵</span>
            <h2 className="font-head text-3xl font-bold text-headline-green sm:text-4xl">{home.whatWeDo.heading}</h2>
            <span aria-hidden="true">⟶</span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {home.whatWeDo.items.map((item, i) => {
              const Icon = ICONS[item.icon] ?? ICONS.exhibitions;
              return (
                <Reveal
                  as="div"
                  key={i}
                  delay={i * 90}
                  className="card-hover rounded-md border-black/10 px-4 pb-4 pt-3 lg:border-r last:lg:border-r-0"
                >
                  <Icon className="mx-auto mb-2.5 h-9 w-9 stroke-terracotta" />
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide">{item.title}</h3>
                  <p className="mb-2.5 min-h-[45px] text-sm leading-relaxed text-muted-soft">{item.text}</p>
                  <Link
                    href={item.linkHref}
                    className="border-b border-transparent text-xs font-semibold uppercase tracking-wide text-terracotta transition-colors duration-300 ease-out hover:border-terracotta"
                  >
                    {item.linkLabel} →
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* PHILOSOPHY / EXPERTISE DUAL PANEL */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <Reveal as="div" className="relative flex min-h-[300px] flex-col justify-center overflow-hidden bg-philosophy-green p-8 text-white">
          <div className="relative z-10 max-w-[320px]">
            <h2 className="mb-2 font-head text-2xl text-white">{home.philosophy.heading}</h2>
            <div className="mb-3 h-0.5 w-12 bg-gold" />
            <p className="mb-2.5 text-sm leading-relaxed text-white/85">{home.philosophy.paragraph}</p>
            <Modal
              title={home.philosophy.heading}
              paragraphs={home.philosophy.modalParagraphs}
              buttonLabel={home.philosophy.buttonLabel}
              buttonClassName="mt-2 inline-flex w-fit items-center gap-2 border border-gold-dark px-5 py-2.5 text-xs uppercase tracking-widest text-gold-dark transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-dark hover:text-white"
            />
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-[45%] md:block">
            <Image src={home.philosophy.image} alt={home.philosophy.alt} fill quality={90} className="object-cover" sizes="50vw" />
          </div>
        </Reveal>

        <Reveal delay={120} className="relative flex min-h-[300px] flex-col justify-center bg-expertise-terracotta p-8 text-white">
          <h2 className="mb-2 font-head text-2xl text-white">{home.expertise.heading}</h2>
          <div className="mb-3 h-0.5 w-12 bg-gold" />
          <div className="flex items-center gap-3.5">
            <div className="relative h-[90px] w-[90px] shrink-0 overflow-hidden rounded-full border-[3px] border-gold shadow-lg sm:h-[110px] sm:w-[110px]">
              <Image src={home.expertise.image} alt={home.expertise.alt} fill quality={90} className="object-cover" sizes="110px" />
            </div>
            <p className="text-sm leading-relaxed text-white/90">{home.expertise.paragraph}</p>
          </div>
          <button className="mt-4 inline-flex w-fit items-center gap-2 border border-white/60 px-5 py-2.5 text-xs uppercase tracking-widest text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-ink">
            {home.expertise.buttonLabel} <span aria-hidden="true">→</span>
          </button>
        </Reveal>
      </section>

      {/* FOOTER QUOTE BANNER */}
      <Reveal as="div" className="bg-footer-gold px-4 py-5 text-center font-head text-base leading-relaxed text-white">
        {home.footerBanner}
      </Reveal>
    </main>
  );
}

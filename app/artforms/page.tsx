import Image from 'next/image';
import type { Metadata } from 'next';
import Modal from '@/components/Modal';
import Reveal from '@/components/Reveal';
import { getPageContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const af = await getPageContent('artforms');
  return { title: af.meta.title, description: af.meta.description };
}

export default async function ArtformsPage() {
  const af = await getPageContent('artforms');

  return (
    <main id="main">
      {af.hero.image ? (
        /* Optional hero image (set in the CMS). A full-bleed box with a
           fixed min-height and object-cover was both too short ("small")
           and, for artwork/illustration photos that bleed to one edge with
           empty canvas elsewhere, cropping the subject to fill a mismatched
           box. Two-column layout with object-contain instead: image gets
           its own column at a generous, fixed-ratio box (never cropped,
           only ever letterboxed), text gets its own padded column — same
           pattern as the About hero. */
        <section className="bg-cream/88 py-10 sm:py-12">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image src={af.hero.image} alt={af.hero.alt || ''} aria-hidden={!af.hero.alt} fill priority quality={90} className="object-contain object-left" sizes="(min-width: 768px) 55vw, 100vw" />
            </div>
            <div className="px-5 md:pl-0 md:pr-8 lg:pr-16">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{af.hero.eyebrow}</div>
              <h1 className="mt-2 font-head text-3xl leading-tight text-headline-green sm:text-4xl">{af.hero.heading}</h1>
              <div className="my-4 h-0.5 w-12 bg-gold" />
              <p className="max-w-[56ch] text-sm leading-relaxed text-muted">{af.hero.lead}</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-header-bg px-5 py-10 text-right sm:py-12">
          <div className="ml-auto max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{af.hero.eyebrow}</div>
            <h1 className="mt-2 font-head text-3xl leading-tight text-headline-green sm:text-4xl">{af.hero.heading}</h1>
            <div className="ml-auto my-4 h-0.5 w-12 bg-gold" />
            <p className="ml-auto max-w-[56ch] text-sm leading-relaxed text-muted">{af.hero.lead}</p>
          </div>
        </section>
      )}

      <section className="bg-cream/88 py-10 sm:py-12">
        <div className="mx-auto max-w-site space-y-10 px-5">
          {af.artforms.map((form, i) => (
            <Reveal
              as="div"
              key={form.id}
              className="grid grid-cols-1 items-center gap-6 border-b border-black/5 pb-8 last:border-b-0 md:grid-cols-2"
            >
              <div className={`group relative aspect-[4/3] w-full overflow-hidden rounded ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                {form.image ? (
                  // A fixed aspect-[4/3] box (vs. the old intrinsic-size
                  // image) so every artform entry fills its column
                  // consistently — a narrow/portrait photo used to render
                  // small inside a much wider column, leaving a lot of bare
                  // space on either side of it. object-contain still never
                  // crops the artwork; a portrait photo now just letterboxes
                  // within this box instead of shrinking the whole column.
                  <Image
                    src={form.image}
                    alt={form.alt || form.title}
                    fill
                    quality={90}
                    className="rounded object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded border border-dashed border-tan/50 bg-cream-deep text-xs uppercase tracking-wide text-tan">
                    Artwork placeholder
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-head text-2xl text-headline-green">{form.title}</h2>
                <div className="mb-2.5 mt-1 text-xs uppercase tracking-wide text-tan">{form.subtitle}</div>
                <p className="mb-3.5 text-sm leading-relaxed text-muted">{form.excerpt}</p>
                <Modal title={form.title} paragraphs={form.modalParagraphs} buttonLabel="Read more" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* bg-cream-deep (#ECE5D3) was too close to the artform list section's
          bg-cream (#F3EFE6) above — nearly the same tone, so the two ran
          together with no visible seam. card-warm is a clearly different
          hue (warm peach vs. cool cream), not just a shade darker. */}
      <section className="bg-card-warm/70 py-10 sm:py-12">
        <div className="mx-auto max-w-site px-5">
          <Reveal as="div" className="mb-8 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{af.programmes.eyebrow}</div>
            <h2 className="mt-2 font-head text-2xl text-headline-green sm:text-3xl">{af.programmes.heading}</h2>
            <div className="my-4 h-0.5 w-12 bg-gold" />
            <p className="text-sm leading-relaxed text-muted">{af.programmes.intro}</p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {af.programmes.cards.map((card, i) => (
              <Reveal as="article" key={i} delay={i * 90} className="card-hover rounded border border-black/5 bg-cream p-5">
                <h3 className="mb-1 font-head text-lg text-headline-green">{card.title}</h3>
                <div className="mb-2 text-xs italic text-tan">{card.withLabel}</div>
                <p className="text-sm leading-relaxed text-muted">{card.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

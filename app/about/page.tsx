import Image from 'next/image';
import type { Metadata } from 'next';
import Modal from '@/components/Modal';
import Reveal from '@/components/Reveal';
import { ICONS } from '@/components/icons';
import { getPageContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const about = await getPageContent('about');
  return { title: about.meta.title, description: about.meta.description };
}

export default async function AboutPage() {
  const about = await getPageContent('about');

  return (
    <main id="main">
      {/* HERO — the source artwork is a tree illustration flush to its own
          left edge with a lot of its own canvas left empty (same pale cream
          as the page background) to its right, built to be used as one
          continuous full-bleed background, not boxed into its own column.
          Putting it in a separate grid cell (the previous version) left a
          visible dead rectangle of blank space between the tree and the
          text — two boxes sitting side by side instead of one picture.
          Full-bleed on desktop instead: the image is the whole section's
          background (object-cover, anchored top-left so only its own blank
          canvas can ever be cropped, never the tree), text overlaid
          directly on top in the right portion — "full width" and "same row
          on laptop" as asked. On mobile there's no room to overlay text
          over a ~150px-tall sliver of this image, so it stacks instead:
          the artwork at its native ratio, then the text block below it. */}
      <section className="relative bg-cream/88 py-10 md:py-0">
        <div className="relative w-full aspect-[1955/803] md:absolute md:inset-0 md:aspect-auto">
          <Image src={about.hero.image} alt={about.hero.alt} fill quality={90} priority className="object-cover object-left-top" sizes="100vw" />
        </div>
        <div className="relative z-10 px-5 py-8 md:flex md:min-h-[460px] md:items-center md:justify-end lg:min-h-[520px]">
          <div className="md:max-w-xl md:pr-10 lg:pr-16">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{about.hero.eyebrow}</div>
            <h1 className="mt-2 font-head text-3xl leading-tight text-headline-green sm:text-4xl">{about.hero.heading}</h1>
            <div className="my-4 h-0.5 w-12 bg-gold" />
            <p className="max-w-[46ch] text-sm leading-relaxed text-muted">{about.hero.lead}</p>
            <blockquote className="mt-5 max-w-md font-head italic leading-snug text-headline-green">
              <p className="text-base sm:text-lg">{about.hero.quote}</p>
              <span className="mt-2 block font-body text-xs not-italic text-muted-soft">— {about.hero.quoteAttribution}</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="grid grid-cols-1 bg-cream/88 md:grid-cols-2">
        <Reveal as="div" className="order-2 flex flex-col justify-center bg-expertise-terracotta p-8 text-white md:order-1 md:p-11">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{about.story.eyebrow}</div>
          <h2 className="mb-1.5 font-head text-2xl leading-tight text-white sm:text-3xl">{about.story.heading}</h2>
          <div className="mb-4 h-0.5 w-12 bg-gold" />
          {about.story.paragraphs.map((p, i) => (
            <p key={i} className="mb-3 text-sm leading-relaxed text-white/90">{p}</p>
          ))}
          <Modal
            title={about.story.heading}
            paragraphs={about.story.modalParagraphs}
            buttonLabel={about.story.buttonLabel}
            buttonClassName="mt-2 inline-flex w-fit items-center gap-2 border border-white/60 px-5 py-2.5 text-xs uppercase tracking-widest text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-ink"
          />
        </Reveal>
        <div className="relative order-1 min-h-[220px] md:order-2">
          <Image src={about.story.image} alt={about.story.alt} fill quality={90} className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="grid grid-cols-1 bg-cream/88 md:grid-cols-2">
        <div className="relative order-1 min-h-[220px]">
          <Image src={about.whatWeDo.image} alt={about.whatWeDo.alt} fill quality={90} className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <Reveal as="div" className="order-2 flex flex-col justify-center p-8 md:p-11">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{about.whatWeDo.eyebrow}</div>
          <h2 className="mb-1.5 font-head text-2xl leading-tight text-headline-green sm:text-3xl">{about.whatWeDo.heading}</h2>
          <div className="mb-4 h-0.5 w-12 bg-gold" />
          <p className="mb-4 text-sm leading-relaxed text-muted">{about.whatWeDo.intro}</p>
          <ul className="list-none space-y-4">
            {about.whatWeDo.items.map((item, i) => {
              const Icon = ICONS[item.icon] ?? ICONS.exhibitions;
              return (
                <li key={i} className="flex items-start gap-3 transition-transform duration-300 ease-out hover:translate-x-1">
                  <span className="mt-0.5 shrink-0 text-terracotta">
                    <Icon className="h-6 w-6 stroke-terracotta" />
                  </span>
                  <div>
                    <h4 className="font-head text-base text-headline-green">{item.title}</h4>
                    <p className="text-sm text-muted">{item.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      {/* PHILOSOPHY */}
      <Reveal as="section" className="relative overflow-hidden bg-[#EFE8D8] px-4 py-8 sm:px-5 sm:py-12">
        <div className="mx-auto grid max-w-site grid-cols-[1.3fr_1fr] items-center gap-4 sm:gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-terracotta sm:mb-2 sm:text-xs">{about.philosophy.eyebrow}</div>
            <h2 className="mb-1.5 font-head text-lg leading-tight text-headline-green sm:text-2xl sm:leading-tight lg:text-[1.7rem]">{about.philosophy.heading}</h2>
            <div className="mb-3 h-0.5 w-10 bg-gold sm:mb-4 sm:w-12" />
            <p className="mb-3 max-w-[48ch] text-xs leading-relaxed text-muted sm:mb-4 sm:text-sm">{about.philosophy.paragraph}</p>
            <Modal title={about.philosophy.heading} paragraphs={about.philosophy.modalParagraphs} buttonLabel={about.philosophy.buttonLabel} />
          </div>
          <div className="relative flex min-h-[160px] items-center justify-center sm:min-h-[220px]">
            {/* The sprig artwork has its own leaf cluster baked into its
                right edge with empty canvas to the left — content.about.json
                already carried this path (philosophy.sprigImage) but no page
                ever rendered it. */}
            <Image
              src={about.philosophy.sprigImage}
              alt=""
              aria-hidden="true"
              fill
              quality={90}
              className="object-contain object-right"
              sizes="(min-width: 768px) 40vw, 90vw"
            />
            <blockquote className="relative z-10 max-w-[18ch] text-center font-head text-xs italic leading-snug text-headline-green sm:text-xl">
              {about.philosophy.quote}
            </blockquote>
          </div>
        </div>
      </Reveal>
    </main>
  );
}

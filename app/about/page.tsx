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
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F6F1E4]">
        {/* max-h caps keep the hero proportional at laptop/desktop widths
            instead of growing taller as the viewport widens. */}
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9] lg:max-h-[380px]">
          <Image src={about.hero.image} alt={about.hero.alt} fill priority quality={90} className="object-cover" sizes="100vw" />
          <div className="absolute inset-x-4 bottom-4 max-w-xs rounded bg-white/90 p-4 font-head italic text-headline-green shadow-lg sm:bottom-8 sm:left-8">
            <p className="text-sm sm:text-base">{about.hero.quote}</p>
            <span className="mt-2 block font-body text-xs not-italic text-tan">— {about.hero.quoteAttribution}</span>
          </div>
        </div>
        <div className="mx-auto max-w-site px-5 py-8">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{about.hero.eyebrow}</div>
          <h1 className="mt-2 font-head text-3xl leading-tight text-headline-green sm:text-4xl">{about.hero.heading}</h1>
          <div className="my-4 h-0.5 w-12 bg-gold" />
          <p className="max-w-[46ch] text-sm leading-relaxed text-muted">{about.hero.lead}</p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <Reveal as="div" className="order-2 flex flex-col justify-center bg-expertise-terracotta p-8 text-white md:order-1 md:p-11">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{about.story.eyebrow}</div>
          <h2 className="mb-1.5 font-head text-2xl leading-tight text-white sm:text-[1.7rem]">{about.story.heading}</h2>
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
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative order-1 min-h-[220px]">
          <Image src={about.whatWeDo.image} alt={about.whatWeDo.alt} fill quality={90} className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <Reveal as="div" className="order-2 flex flex-col justify-center p-8 md:p-11">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{about.whatWeDo.eyebrow}</div>
          <h2 className="mb-1.5 font-head text-2xl leading-tight text-headline-green sm:text-[1.7rem]">{about.whatWeDo.heading}</h2>
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
      <Reveal as="section" className="relative overflow-hidden bg-[#EFE8D8] px-5 py-12">
        <div className="mx-auto grid max-w-site grid-cols-1 items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{about.philosophy.eyebrow}</div>
            <h2 className="mb-1.5 font-head text-2xl leading-tight text-headline-green sm:text-[1.7rem]">{about.philosophy.heading}</h2>
            <div className="mb-4 h-0.5 w-12 bg-gold" />
            <p className="mb-4 max-w-[48ch] text-sm leading-relaxed text-muted">{about.philosophy.paragraph}</p>
            <Modal title={about.philosophy.heading} paragraphs={about.philosophy.modalParagraphs} buttonLabel={about.philosophy.buttonLabel} />
          </div>
          <div className="flex flex-col items-center gap-4">
            {about.philosophy.sprigImage && (
              <div className="relative h-32 w-32">
                <Image src={about.philosophy.sprigImage} alt="" fill aria-hidden="true" quality={90} className="object-contain" sizes="128px" />
              </div>
            )}
            <blockquote className="text-center font-head text-xl italic leading-snug text-headline-green">
              {about.philosophy.quote}
            </blockquote>
          </div>
        </div>
      </Reveal>
    </main>
  );
}

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
      <section className="bg-header-bg px-5 py-10 text-center sm:py-12">
        <div className="mx-auto max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{af.hero.eyebrow}</div>
          <h1 className="mt-2 font-head text-3xl leading-tight text-headline-green sm:text-4xl">{af.hero.heading}</h1>
          <div className="mx-auto my-4 h-0.5 w-12 bg-gold" />
          <p className="mx-auto max-w-[56ch] text-sm leading-relaxed text-muted">{af.hero.lead}</p>
        </div>
      </section>

      <section className="bg-cream/93 py-10 sm:py-12">
        <div className="mx-auto max-w-site space-y-10 px-5">
          {af.artforms.map((form, i) => (
            <Reveal
              as="div"
              key={form.id}
              className="grid grid-cols-1 items-center gap-6 border-b border-black/5 pb-8 last:border-b-0 md:grid-cols-2"
            >
              <div className={`group relative aspect-[4/3] w-full overflow-hidden rounded bg-cream-deep ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                {form.image ? (
                  <Image
                    src={form.image}
                    alt={form.alt || form.title}
                    fill
                    quality={90}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center border border-dashed border-tan/50 text-xs uppercase tracking-wide text-tan">
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

      <section className="bg-cream-deep/93 py-10 sm:py-12">
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

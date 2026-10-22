import type { Metadata } from 'next';
import MediaFlipbook from '@/components/MediaFlipbook';
import Reveal from '@/components/Reveal';
import { getPageContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const media = await getPageContent('media');
  return { title: media.meta.title, description: media.meta.description };
}

export default async function MediaPage() {
  const media = await getPageContent('media');

  return (
    // No more one-off dark background here — this page now uses the same
    // warm cream palette as every other page, so the shared header/footer
    // don't sit against a jarring dark band.
    <main id="main">
      <section className="bg-gradient-to-b from-cream/88 to-[#EFE8D8]/88 px-5 py-10 text-center sm:py-12">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">{media.hero.eyebrow}</div>
        <h1 className="mt-2 font-head text-3xl text-headline-green sm:text-4xl">{media.hero.heading}</h1>
        <p className="mx-auto mt-3 max-w-[52ch] text-sm leading-relaxed text-muted">{media.hero.lead}</p>
      </section>

      <Reveal as="section" className="bg-cream-deep/88 py-10 sm:py-12">
        <MediaFlipbook items={media.items} />
      </Reveal>

      {media.pressLinks && media.pressLinks.items.length > 0 && (
        <Reveal as="section" className="bg-cream/88 py-10 sm:py-12">
          <div className="mx-auto max-w-site px-5">
            <h2 className="mb-6 font-head text-2xl leading-tight text-headline-green sm:text-3xl">
              {media.pressLinks.heading}
            </h2>
            <ul className="list-none divide-y divide-black/5 border-t border-black/5">
              {media.pressLinks.items.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-0.5 py-4 transition-colors duration-300 ease-out sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm font-medium text-ink group-hover:text-terracotta">
                      {item.title}
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-xs uppercase tracking-wide text-muted-soft">
                      {item.publication && <span>{item.publication}</span>}
                      <span aria-hidden="true" className="text-terracotta">→</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </main>
  );
}

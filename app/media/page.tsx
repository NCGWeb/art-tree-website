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
    </main>
  );
}

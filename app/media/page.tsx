import type { Metadata } from 'next';
import MediaFlipbook from '@/components/MediaFlipbook';
import { getPageContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const media = await getPageContent('media');
  return { title: media.meta.title, description: media.meta.description };
}

export default async function MediaPage() {
  const media = await getPageContent('media');

  return (
    <main id="main" className="bg-[#1d2417]">
      <section className="bg-gradient-to-b from-[#F3EFE6] to-[#EFE8D8] px-5 py-10 text-center">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[2px] text-terracotta">{media.hero.eyebrow}</div>
        <h1 className="mt-2 font-head text-3xl text-headline-green sm:text-4xl">{media.hero.heading}</h1>
        <p className="mx-auto mt-3 max-w-[52ch] text-sm text-[#4a473c]">{media.hero.lead}</p>
      </section>

      <section className="py-12">
        <MediaFlipbook items={media.items} />
      </section>
    </main>
  );
}

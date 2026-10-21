import Image from 'next/image';
import Reveal from '@/components/Reveal';

/**
 * Lotus-flanked italic quote banner, used on both Contact and Gallery.
 *
 * Built as 3 separate flex items (left flower crop / quote / right flower
 * crop) rather than one full-bleed decorative image behind the text. A
 * single full-bleed background image scales the flower clusters and the
 * safe center zone by the same proportion as the viewport, so on narrower
 * screens the clusters creep inward and collide with the quote. As flex
 * siblings here, the clusters and the text can never overlap at any
 * width — flex children never render on top of each other — and each
 * side shrinks independently per breakpoint.
 */
export default function LotusQuoteBanner({ quote }: { quote: string }) {
  return (
    <Reveal as="section" className="bg-[#F6F1E4] px-4 py-8 sm:py-10 md:py-12">
      <div className="mx-auto flex max-w-site items-center justify-center gap-3 sm:gap-6 md:gap-10 lg:gap-14">
        <div className="relative h-12 w-16 shrink-0 overflow-hidden sm:h-16 sm:w-24 md:h-20 md:w-32 lg:h-24 lg:w-40">
          <Image src="/images/footer-lotus.webp" alt="" aria-hidden="true" fill className="object-cover object-left" sizes="160px" />
        </div>

        <blockquote className="max-w-[22ch] shrink text-center font-head text-sm italic leading-snug text-headline-green sm:max-w-xs sm:text-base md:max-w-sm md:text-lg lg:max-w-md lg:text-xl">
          {quote}
        </blockquote>

        <div className="relative h-12 w-16 shrink-0 overflow-hidden sm:h-16 sm:w-24 md:h-20 md:w-32 lg:h-24 lg:w-40">
          <Image src="/images/footer-lotus.webp" alt="" aria-hidden="true" fill className="object-cover object-right" sizes="160px" />
        </div>
      </div>
    </Reveal>
  );
}

import Image from 'next/image';
import Reveal from '@/components/Reveal';

/**
 * Lotus-flanked italic quote banner, used on both Contact and Gallery.
 *
 * Built as 3 flex items (left flower / quote / right flower) so the
 * clusters and the text can never overlap at any width — flex children
 * never render on top of each other. The flex row spans the full section
 * width (no inner max-width constraining it) so the flower clusters sit at
 * the true left/right edges of the page, like the reference design, with
 * the quote centered in the remaining space. `object-contain` (not `cover`)
 * so the full flower illustration is always shown un-cropped at full
 * quality, never zoomed into a soft/blurry fragment of itself.
 */
export default function LotusQuoteBanner({ quote }: { quote: string }) {
  return (
    <Reveal as="section" className="overflow-hidden bg-[#F6F1E4] py-8 sm:py-10 md:py-12">
      <div className="flex w-full items-center justify-between gap-2 px-1 sm:gap-4 sm:px-2 md:gap-8">
        <div className="relative h-16 w-20 shrink-0 sm:h-24 sm:w-32 md:h-32 md:w-44 lg:h-36 lg:w-56">
          <Image src="/images/footer-lotus.webp" alt="" aria-hidden="true" fill quality={90} className="object-contain object-left" sizes="(min-width: 1024px) 224px, (min-width: 768px) 176px, 128px" />
        </div>

        <blockquote className="max-w-[22ch] shrink text-center font-head text-sm italic leading-snug text-headline-green sm:max-w-xs sm:text-base md:max-w-sm md:text-lg lg:max-w-md lg:text-xl">
          {quote}
        </blockquote>

        <div className="relative h-16 w-20 shrink-0 sm:h-24 sm:w-32 md:h-32 md:w-44 lg:h-36 lg:w-56">
          <Image src="/images/footer-lotus.webp" alt="" aria-hidden="true" fill quality={90} className="object-contain object-right" sizes="(min-width: 1024px) 224px, (min-width: 768px) 176px, 128px" />
        </div>
      </div>
    </Reveal>
  );
}

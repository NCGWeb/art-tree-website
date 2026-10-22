import Image from 'next/image';
import Reveal from '@/components/Reveal';

/**
 * Lotus quote banner, used on both Contact and Gallery, always the last
 * section before the site footer.
 *
 * The source artwork (/images/footer-lotus.webp) already has a flower
 * cluster baked into its own left edge AND its own right edge, so it's
 * rendered as a SINGLE full-width image here (not duplicated into two
 * separate <Image> crops) to avoid the flowers showing up twice.
 *
 * Below the `sm` breakpoint the image's very wide 1999:667 aspect ratio
 * leaves too little height to fit both the flowers and the quote without
 * stacking or overlap, so on mobile the artwork is dropped entirely and
 * just the quote renders, sitting directly above the footer. From `sm` up
 * there's enough height for the full artwork, quote centered on top of it.
 */
export default function LotusQuoteBanner({ quote }: { quote: string }) {
  return (
    <Reveal as="section" className="overflow-hidden bg-[#F6F1E4]">
      <div className="px-5 py-8 text-center sm:hidden">
        <blockquote className="mx-auto max-w-[24ch] font-head text-sm italic leading-snug text-headline-green">
          {quote}
        </blockquote>
      </div>

      <div className="relative hidden w-full sm:block" style={{ aspectRatio: '1999 / 667' }}>
        <Image
          src="/images/footer-lotus.webp"
          alt=""
          aria-hidden="true"
          fill
          quality={90}
          className="object-contain"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center px-5">
          <blockquote className="max-w-xs text-center font-head text-base italic leading-snug text-headline-green md:max-w-sm md:text-lg lg:max-w-md lg:text-xl">
            {quote}
          </blockquote>
        </div>
      </div>
    </Reveal>
  );
}

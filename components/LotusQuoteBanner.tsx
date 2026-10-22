import Image from 'next/image';
import Reveal from '@/components/Reveal';

/**
 * Lotus quote banner, used on both Contact and Gallery.
 *
 * The source artwork (/images/footer-lotus.webp) already has a flower
 * cluster baked into its own left edge AND its own right edge, so it's
 * rendered as a SINGLE full-width image here (not duplicated into two
 * separate <Image> crops) to avoid the flowers showing up twice. The
 * image's native 1999:667 aspect ratio is preserved at every width so it
 * is never cropped top or bottom, on mobile or desktop, and the quote
 * sits centered on top of it.
 */
export default function LotusQuoteBanner({ quote }: { quote: string }) {
  return (
    <Reveal as="section" className="relative overflow-hidden bg-[#F6F1E4]">
      <div className="relative w-full" style={{ aspectRatio: '1999 / 667' }}>
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
          <blockquote className="max-w-[22ch] text-center font-head text-sm italic leading-snug text-headline-green sm:max-w-xs sm:text-base md:max-w-sm md:text-lg lg:max-w-md lg:text-xl">
            {quote}
          </blockquote>
        </div>
      </div>
    </Reveal>
  );
}

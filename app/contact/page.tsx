import Image from 'next/image';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import { PhoneIcon, MailIcon, PinIcon, YoutubeIcon, FacebookIcon, InstagramIcon } from '@/components/icons';
import { getPageContent, getSiteSettings } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getPageContent('contact');
  return { title: contact.meta.title, description: contact.meta.description };
}

export default async function ContactPage() {
  const contact = await getPageContent('contact');
  const site = await getSiteSettings();

  return (
    <main id="main">
      {/* HERO — compact side-by-side on desktop (text left, photo right),
          and on mobile the same photo sits as a full-bleed background
          behind the text with a scrim for contrast, per the client's
          reference mockup. One <Image> only (not two), sized responsively
          via the `sizes` prop, so mobile and desktop never both fetch a
          full copy. */}
      <section className="relative overflow-hidden bg-[#F6F1E4]">
        <div className="relative flex min-h-[420px] flex-col md:min-h-[380px] md:flex-row md:items-stretch">
          <div className="absolute inset-0 md:relative md:inset-auto md:order-2 md:w-1/2">
            <Image
              src={contact.hero.image}
              alt={contact.hero.alt}
              fill
              priority
              className="object-cover"
              // The framed painting sits on the right ~55-100% of the source
              // photo (vase/books/blank wall occupy the left side). Anchoring
              // object-position toward that side keeps the painting in frame
              // instead of the default center crop, which — especially on a
              // narrow/tall mobile crop — could show mostly blank wall and
              // read as "cropped oddly" / not a true background fill.
              style={{ objectPosition: '72% center' }}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            {/* Mobile-only scrim so the heading/lead stay readable over the photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/10 md:hidden" />
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-center px-5 py-10 md:order-1 md:w-1/2 md:py-0 md:pl-6 lg:pl-10">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white md:text-terracotta">{contact.hero.eyebrow}</div>
            <h1 className="mt-2 font-head text-3xl text-white sm:text-4xl md:text-headline-green">{contact.hero.heading}</h1>
            <div className="my-4 h-0.5 w-12 bg-gold" />
            <p className="max-w-[42ch] text-sm leading-relaxed text-white/90 md:text-muted">{contact.hero.lead}</p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-10 sm:py-12">
        <div className="mx-auto grid max-w-site grid-cols-1 gap-10 px-5 lg:grid-cols-[1fr_1.2fr]">
          <Reveal as="div">
            <h2 className="mb-1.5 font-head text-2xl text-headline-green">Contact Information</h2>
            <div className="mb-5 h-0.5 w-12 bg-gold" />

            <div className="mb-4 flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-dark text-terracotta">
                <PhoneIcon className="h-4 w-4" />
              </span>
              <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="border-b border-transparent pt-1.5 text-sm text-ink transition-colors duration-300 ease-out hover:border-terracotta hover:text-terracotta">
                {contact.phone}
              </a>
            </div>

            <div className="mb-4 flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-dark text-terracotta">
                <MailIcon className="h-4 w-4" />
              </span>
              <div className="pt-1.5 text-sm text-ink">
                {contact.emails.map((e: string, i: number) => (
                  <div key={i}>
                    <a href={`mailto:${e}`} className="border-b border-transparent transition-colors duration-300 ease-out hover:border-terracotta hover:text-terracotta">{e}</a>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-dark text-terracotta">
                <PinIcon className="h-4 w-4" />
              </span>
              <div className="pt-1.5 text-sm text-ink">
                {contact.location} <em className="block text-xs text-tan not-italic">({contact.locationNote})</em>
              </div>
            </div>

            <h3 className="mb-3 font-head text-lg text-headline-green">Follow Us</h3>
            {/* Exactly 3 icons (Instagram, Facebook, YouTube) — matches the
                shared SiteFooter, which already only renders this set. */}
            <div className="mb-8 flex gap-3">
              <a href={contact.socials.instagram || '#'} aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-terracotta/10 hover:text-terracotta">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href={contact.socials.facebook || '#'} aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-terracotta/10 hover:text-terracotta">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href={contact.socials.youtube || '#'} aria-label="YouTube" className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-terracotta/10 hover:text-terracotta">
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>

            <div>
              <h3 className="mb-2 font-head text-lg text-headline-green">You can also write to</h3>
              <div className="text-sm font-semibold text-ink">{contact.founder.name}</div>
              <div className="mb-2 text-xs text-tan">{contact.founder.role}</div>
              <blockquote className="font-head text-sm italic leading-relaxed text-muted">{contact.founder.quote}</blockquote>
            </div>
          </Reveal>

          <Reveal as="div" delay={120}>
            <ContactForm
              recipientEmail={contact.recipientEmail}
              defaultSubject={contact.form.defaultSubject}
              labels={contact.form}
            />
          </Reveal>
        </div>
      </section>

      {/* Lotus-flanked quote banner, matching the client's reference mockup.
          Reuses the site's existing footer-banner copy (no new copy) and
          the existing footer-lotus.webp decorative asset.
          Built as 3 separate flex items (left flower crop / quote / right
          flower crop) rather than one full-bleed image behind the text.
          That one-image-as-background approach scales the flower clusters
          and the safe center zone by the SAME proportion as the viewport,
          so the clusters crept in and collided with the quote on narrower
          screens. As separate flex siblings, the clusters and the text can
          never overlap at any width — flex children simply don't render on
          top of each other — and each side shrinks independently via its
          own responsive size classes ("reduce the image as needed" on
          mobile). */}
      <Reveal as="section" className="bg-[#F6F1E4] px-4 py-8 sm:py-10 md:py-12">
        <div className="mx-auto flex max-w-site items-center justify-center gap-3 sm:gap-6 md:gap-10 lg:gap-14">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden sm:h-16 sm:w-24 md:h-20 md:w-32 lg:h-24 lg:w-40">
            <Image src="/images/footer-lotus.webp" alt="" aria-hidden="true" fill className="object-cover object-left" sizes="160px" />
          </div>

          <blockquote className="max-w-[22ch] shrink text-center font-head text-sm italic leading-snug text-headline-green sm:max-w-xs sm:text-base md:max-w-sm md:text-lg lg:max-w-md lg:text-xl">
            {site.footerBanner}
          </blockquote>

          <div className="relative h-12 w-16 shrink-0 overflow-hidden sm:h-16 sm:w-24 md:h-20 md:w-32 lg:h-24 lg:w-40">
            <Image src="/images/footer-lotus.webp" alt="" aria-hidden="true" fill className="object-cover object-right" sizes="160px" />
          </div>
        </div>
      </Reveal>
    </main>
  );
}

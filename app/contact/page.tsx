import Image from 'next/image';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Reveal from '@/components/Reveal';
import LotusQuoteBanner from '@/components/LotusQuoteBanner';
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
      {/* HERO — full-bleed background photo edge-to-edge at every width,
          text overlaid on the left over a scrim. One <Image> only, full
          width/height of the section on mobile AND desktop (no side-by-side
          split), so the photo always spans the entire hero. */}
      <section className="relative isolate overflow-hidden">
        <div className="relative flex min-h-[420px] flex-col justify-center md:min-h-[460px] lg:min-h-[520px]">
          <Image
            src={contact.hero.image}
            alt={contact.hero.alt}
            fill
            priority
            quality={90}
            className="object-cover"
            // The framed painting sits on the right ~55-100% of the source
            // photo (vase/books/blank wall occupy the left side). Anchoring
            // object-position toward that side keeps the painting in frame
            // instead of the default center crop, and leaves the left side
            // of the frame clearer for the text + scrim.
            style={{ objectPosition: '68% center' }}
            sizes="100vw"
          />
          {/* Scrim: dark-to-light left-to-right on desktop (text sits left,
              photo stays visible on the right), and a vertical top-down
              scrim on mobile where the text stacks over the full image. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/50 to-ink/15 md:bg-gradient-to-r md:from-ink/85 md:via-ink/55 md:to-ink/10" />

          <div className="relative z-10 px-5 py-10 md:max-w-xl md:py-0 md:pl-10 lg:pl-16">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">{contact.hero.eyebrow}</div>
            <h1 className="mt-2 font-head text-3xl text-white sm:text-4xl">{contact.hero.heading}</h1>
            <div className="my-4 h-0.5 w-12 bg-gold" />
            <p className="max-w-[42ch] text-sm leading-relaxed text-white/90">{contact.hero.lead}</p>
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

      {/* Reuses the site's existing footer-banner copy — no new copy here. */}
      <LotusQuoteBanner quote={site.footerBanner} />
    </main>
  );
}

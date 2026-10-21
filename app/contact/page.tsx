import Image from 'next/image';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { PhoneIcon, MailIcon, PinIcon, TwitterIcon, YoutubeIcon, FacebookIcon, InstagramIcon } from '@/components/icons';
import { getPageContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getPageContent('contact');
  return { title: contact.meta.title, description: contact.meta.description };
}

export default async function ContactPage() {
  const contact = await getPageContent('contact');

  return (
    <main id="main">
      <section className="relative overflow-hidden bg-[#F6F1E4]">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image src={contact.hero.image} alt={contact.hero.alt} fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="mx-auto max-w-site px-5 py-8">
          <div className="text-[0.7rem] font-semibold uppercase tracking-[2px] text-terracotta">{contact.hero.eyebrow}</div>
          <h1 className="mt-2 font-head text-3xl text-headline-green sm:text-4xl">{contact.hero.heading}</h1>
          <div className="my-4 h-0.5 w-11 bg-gold" />
          <p className="max-w-[46ch] text-sm leading-relaxed text-[#4a473c]">{contact.hero.lead}</p>
        </div>
      </section>

      <section className="bg-cream py-10">
        <div className="mx-auto grid max-w-site grid-cols-1 gap-10 px-5 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="mb-1.5 font-head text-2xl text-headline-green">Contact Information</h2>
            <div className="mb-5 h-0.5 w-11 bg-gold" />

            <div className="mb-4 flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-dark text-terracotta">
                <PhoneIcon className="h-4 w-4" />
              </span>
              <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="pt-1.5 text-sm text-ink">
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
                    <a href={`mailto:${e}`}>{e}</a>
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
            <div className="mb-8 flex gap-3">
              <a href={contact.socials.twitter || '#'} aria-label="Twitter" className="text-ink hover:text-terracotta">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href={contact.socials.youtube || '#'} aria-label="YouTube" className="text-ink hover:text-terracotta">
                <YoutubeIcon className="h-5 w-5" />
              </a>
              <a href={contact.socials.facebook || '#'} aria-label="Facebook" className="text-ink hover:text-terracotta">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href={contact.socials.instagram || '#'} aria-label="Instagram" className="text-ink hover:text-terracotta">
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>

            <div>
              <h3 className="mb-2 font-head text-lg text-headline-green">You can also write to</h3>
              <div className="text-sm font-semibold text-ink">{contact.founder.name}</div>
              <div className="mb-2 text-xs text-tan">{contact.founder.role}</div>
              <blockquote className="font-head text-sm italic leading-relaxed text-[#4a473c]">{contact.founder.quote}</blockquote>
            </div>
          </div>

          <ContactForm
            recipientEmail={contact.recipientEmail}
            defaultSubject={contact.form.defaultSubject}
            labels={contact.form}
          />
        </div>
      </section>
    </main>
  );
}

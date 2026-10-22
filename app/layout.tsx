import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import WhatsAppFab from '@/components/WhatsAppFab';
import { getSiteSettings } from '@/lib/content';

// Edits saved in the admin should appear on the next request without a
// redeploy, so every page in the app renders dynamically (no static cache).
export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Art Tree | Stories You Can Touch",
  description:
    "Art Tree celebrates the art, stories and soul of India's folk and tribal heritage through exhibitions, artist support, public programmes, education and collections.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteSettings();
  const bodyBgImage = (site as { bodyBackgroundImage?: string }).bodyBackgroundImage;

  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className={`font-body text-ink antialiased ${bodyBgImage ? '' : 'bg-cream'}`}>
        {bodyBgImage && (
          // A fixed, viewport-pinned layer behind everything, so it scrolls
          // with nothing and never competes with the header/footer's own
          // opaque backgrounds or a page's hero image on top of it. The
          // flat-color gradient over the image lightens it to a faint
          // texture (page sections lay their own near-opaque cream tint on
          // top of this too — see the bg-cream/93 etc. classes across the
          // page files) rather than the image's true saturated colors.
          <div
            aria-hidden="true"
            className="fixed inset-0 -z-10"
            style={{
              backgroundImage: `linear-gradient(rgba(250, 247, 240, 0.93), rgba(250, 247, 240, 0.93)), url(${bodyBgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader nav={site.nav} tagline={site.tagline} logoAlt={site.logoAlt} />
        {children}
        <SiteFooter
          footerNav={site.footerNav}
          footerTagline={site.footerTagline}
          footerBanner={undefined}
          logoAlt={site.logoAlt}
          copyrightName={site.copyrightName}
          socials={site.socials}
        />
        <WhatsAppFab number={site.whatsappNumber} />
      </body>
    </html>
  );
}

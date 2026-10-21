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

  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="bg-cream font-body text-ink antialiased">
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

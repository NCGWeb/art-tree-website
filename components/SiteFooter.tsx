import Image from 'next/image';
import Link from 'next/link';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/icons';

type NavItem = { label: string; href: string };

export default function SiteFooter({
  footerNav,
  footerTagline,
  footerBanner,
  logoAlt,
  copyrightName,
  socials,
}: {
  footerNav: NavItem[];
  footerTagline: string;
  footerBanner?: string;
  logoAlt: string;
  copyrightName: string;
  socials: { instagram?: string; facebook?: string; youtube?: string };
}) {
  const year = new Date().getFullYear();

  return (
    <>
      {footerBanner && (
        <div className="bg-footer-gold px-4 py-5 text-center font-head text-base leading-relaxed text-white">
          {footerBanner}
        </div>
      )}
      <footer className="bg-ink pb-4 pt-9 text-[#d9d5c6]">
        <div className="mx-auto max-w-site px-5">
          <div className="mb-6 flex flex-col flex-wrap items-start justify-between gap-8 md:flex-row">
            <div>
              <Link href="/" className="inline-block">
                <Image src="/images/logo.png" alt={logoAlt} width={140} height={71} className="h-10 w-auto" />
              </Link>
              <div className="mt-2 text-sm text-[#bfbba9]">{footerTagline}</div>
            </div>

            <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {footerNav.map((item, i) => (
                <Link key={i} href={item.href} className="transition-colors hover:text-gold">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wide text-[#bfbba9]">Connect With Us</div>
              <div className="flex gap-3">
                <a href={socials.instagram || '#'} aria-label="Instagram" className="text-[#d9d5c6] hover:text-gold">
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a href={socials.facebook || '#'} aria-label="Facebook" className="text-[#d9d5c6] hover:text-gold">
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <a href={socials.youtube || '#'} aria-label="YouTube" className="text-[#d9d5c6] hover:text-gold">
                  <YoutubeIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-3 text-center text-xs text-[#9a9780]">
            &copy; {year} {copyrightName}. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

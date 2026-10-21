'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type NavItem = { label: string; href: string };

export default function SiteHeader({
  nav,
  tagline,
  logoAlt,
}: {
  nav: NavItem[];
  tagline: string;
  logoAlt: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile panel whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    // z-[1000] (rather than a low sticky z-index) so the slide-in panel and
    // its backdrop — nested inside this header — can sit above the
    // WhatsApp FAB (z-[999]) and other page content once opened. Without
    // this, a child's z-index can never escape its parent's own stacking
    // context, so the FAB would otherwise poke through the open menu.
    <header className="sticky top-0 z-[1000] border-b border-black/5 bg-gradient-to-b from-[#E9DFC4] to-header-bg">
      <div className="mx-auto flex max-w-site items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="Art Tree home">
          <Image src="/images/logo.png" alt={logoAlt} width={140} height={71} className="h-11 w-auto" priority />
          <span className="hidden text-[0.6rem] uppercase tracking-[2px] text-olive sm:inline">
            {tagline}
          </span>
        </Link>

        {/* Animated hamburger -> X. Sits above the backdrop/panel (z-20
            inside this header's own stacking context) so it stays crisp
            and clickable while the menu is open. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobileNav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
          className="relative z-20 flex h-11 w-11 shrink-0 items-center justify-center md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 rounded-full bg-ink transition-all duration-300 ease-out ${
                open ? 'top-[7px] rotate-45' : 'top-0 rotate-0'
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-0.5 w-6 rounded-full bg-ink transition-opacity duration-200 ease-out ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 rounded-full bg-ink transition-all duration-300 ease-out ${
                open ? 'top-[7px] -rotate-45' : 'top-[14px] rotate-0'
              }`}
            />
          </span>
        </button>

        <nav id="mainNav" aria-label="Primary" className="hidden md:block">
          <ul className="flex list-none gap-6">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`border-b-2 pb-1.5 pt-1.5 text-[0.75rem] font-medium uppercase tracking-wide transition-colors duration-300 ease-out ${
                      active
                        ? 'border-gold-dark text-terracotta'
                        : 'border-transparent text-ink hover:border-gold-dark hover:text-terracotta'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-10 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ease-out md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Slide-in panel */}
      <nav
        id="mobileNav"
        aria-label="Primary mobile"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-10 h-full w-[82%] max-w-[360px] transform bg-header-bg shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center border-b border-black/10 px-5">
          <span className="font-head text-base text-headline-green">Menu</span>
        </div>
        <ul className="flex list-none flex-col gap-1 px-3 py-4">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-[48px] items-center rounded px-4 text-sm font-medium uppercase tracking-wide transition-colors duration-200 ease-out ${
                    active ? 'bg-gold/15 text-terracotta' : 'text-ink hover:bg-gold/10 hover:text-terracotta'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-gradient-to-b from-[#E9DFC4] to-header-bg">
      <div className="mx-auto flex max-w-site items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="Art Tree home">
          <Image src="/images/logo.png" alt={logoAlt} width={140} height={71} className="h-11 w-auto" priority />
          <span className="hidden text-[0.6rem] uppercase tracking-[2px] text-olive sm:inline">
            {tagline}
          </span>
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mainNav"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-6 bg-ink" />
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
                    className={`border-b-2 pb-1.5 pt-1.5 text-[0.75rem] font-medium uppercase tracking-wide transition-colors ${
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

      {open && (
        <nav aria-label="Primary mobile" className="border-t border-black/5 bg-header-bg px-4 pb-4 pt-2 md:hidden">
          <ul className="flex list-none flex-col gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium uppercase tracking-wide text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

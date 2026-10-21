import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';

const NAV = [
  { label: 'Overview', href: '/admin' },
  { label: 'Home', href: '/admin/home' },
  { label: 'About', href: '/admin/about' },
  { label: 'Exhibitions', href: '/admin/exhibitions' },
  { label: 'Art Forms', href: '/admin/artforms' },
  { label: 'Gallery', href: '/admin/gallery' },
  { label: 'Media', href: '/admin/media' },
  { label: 'Contact', href: '/admin/contact' },
  { label: 'Site Settings', href: '/admin/settings' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F3EFE6] font-body text-ink">
      <header className="flex items-center justify-between bg-headline-green px-5 py-3 text-white">
        <div className="font-head text-lg">Art Tree — Admin</div>
        <LogoutButton />
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6 md:flex-row">
        <nav className="shrink-0 md:w-52">
          <ul className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded px-3 py-2 text-sm font-medium text-ink hover:bg-cream-deep"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}

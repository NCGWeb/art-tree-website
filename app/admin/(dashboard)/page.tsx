import Link from 'next/link';

const PAGES = [
  { label: 'Home', href: '/admin/home', live: '/' },
  { label: 'About', href: '/admin/about', live: '/about' },
  { label: 'Exhibitions', href: '/admin/exhibitions', live: '/exhibitions' },
  { label: 'Art Forms', href: '/admin/artforms', live: '/artforms' },
  { label: 'Gallery', href: '/admin/gallery', live: '/gallery' },
  { label: 'Media', href: '/admin/media', live: '/media' },
  { label: 'Contact', href: '/admin/contact', live: '/contact' },
  { label: 'Site Settings', href: '/admin/settings', live: '/' },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="mb-2 font-head text-2xl text-headline-green">Welcome back</h1>
      <p className="mb-6 max-w-prose text-sm text-[#4a473c]">
        Pick a page below to edit its text and images. Changes go live as soon as you click
        &ldquo;Save changes&rdquo; on that page, no developer needed.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded border border-black/10 bg-white p-4 shadow-sm transition hover:border-terracotta hover:shadow-md"
          >
            <div className="font-head text-lg text-headline-green">{p.label}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-tan">Edit content →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

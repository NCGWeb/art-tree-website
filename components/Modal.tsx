'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
  title,
  paragraphs,
  buttonLabel = 'Read more',
  buttonClassName,
}: {
  title: string;
  paragraphs: string[];
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          buttonClassName ??
          'mt-2 inline-flex w-fit items-center gap-2 border border-ink px-5 py-2.5 text-xs uppercase tracking-widest text-ink transition-colors duration-300 ease-out hover:bg-ink hover:text-cream'
        }
      >
        {buttonLabel} <span aria-hidden="true">→</span>
      </button>

      {/* Rendered via a portal straight into <body>: the "Read more" buttons
          across the site live inside <Reveal> sections, and Reveal's CSS
          animates `transform` on that section (see .reveal/.reveal-visible
          in app/globals.css). A `transform` on an ancestor creates a new
          containing block for `position: fixed` descendants, so without the
          portal this modal was positioning itself relative to that section
          instead of the viewport — clipped to the section's box instead of
          centered over the whole page. */}
      {mounted && open &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex animate-fadeIn overflow-y-auto overflow-x-hidden p-4 sm:p-6">
            <div
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="relative z-[2] m-auto max-h-[85vh] w-full max-w-[640px] overflow-y-auto overflow-x-auto rounded-md bg-white shadow-2xl animate-fadeIn">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-3 top-3 z-[3] flex h-10 w-10 items-center justify-center rounded-full text-lg text-ink transition-all duration-300 ease-out hover:scale-110 hover:bg-cream hover:text-terracotta"
              >
                ✕
              </button>
              <h3 className="border-b-2 border-gold px-6 pb-3 pt-6 font-head text-2xl text-headline-green">
                {title}
              </h3>
              <div className="space-y-3 px-6 pb-6 pt-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

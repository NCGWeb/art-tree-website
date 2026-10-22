'use client';

import { forwardRef, useEffect, useRef, useState, type ComponentType } from 'react';

type MediaItem = { image: string; alt: string };

// react-pageflip targets its own ref directly at each page's root DOM node
// to size/position/flip it, so every page must forward a ref.
const Page = forwardRef<HTMLDivElement, { image: string; alt: string; priority?: boolean }>(
  ({ image, alt, priority }, ref) => (
    <div ref={ref} className="flex h-full w-full items-center justify-center bg-white">
      {/* Plain <img>, not next/image: the flip engine applies its own
          absolute positioning/transform to this element while dragging, and
          a lazily-hydrated next/image fill box doesn't play well with that.
          Only the first couple of pages skip native lazy-loading. */}
      <img
        src={image}
        alt={alt}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        className="h-full w-full select-none object-contain"
      />
    </div>
  ),
);
Page.displayName = 'MediaFlipbookPage';

export default function MediaFlipbook({ items }: { items: MediaItem[] }) {
  const bookRef = useRef<any>(null);
  const [pageIndex, setPageIndex] = useState(0);
  // react-pageflip (StPageFlip under the hood) measures and manipulates the
  // DOM on mount, so it can never run during SSR. Rather than
  // next/dynamic(..., { ssr: false }) — whose loader wrapper is a plain
  // function component and silently drops the ref this library needs to
  // expose its flip API — the module is imported inside an effect, which
  // only ever runs in the browser, and the real forwardRef-wrapped
  // component is used directly once it resolves.
  const [FlipBook, setFlipBook] = useState<ComponentType<any> | null>(null);
  const total = items.length;

  useEffect(() => {
    let cancelled = false;
    import('react-pageflip').then((mod) => {
      if (!cancelled) setFlipBook(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function prev() {
    bookRef.current?.pageFlip?.()?.flipPrev();
  }
  function next() {
    bookRef.current?.pageFlip?.()?.flipNext();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (total === 0) {
    return <p className="text-center text-sm text-muted-soft">No press coverage has been added yet.</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4">
      <div className="flex w-full items-center justify-center gap-2 sm:gap-5">
        <button
          type="button"
          onClick={prev}
          disabled={pageIndex <= 0}
          aria-label="Previous page"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-headline-green/30 text-xl text-headline-green transition-all duration-300 ease-out hover:border-terracotta hover:bg-terracotta/10 hover:text-terracotta disabled:pointer-events-none disabled:opacity-30"
        >
          ‹
        </button>

        {/* 70vw as asked — the old max-w-xl (576px) cap made the book look
            tiny on wide desktop screens regardless of viewport size. The
            FlipBook's own maxWidth/maxHeight props (below) must be raised
            too, or its internal "stretch" sizing would still cap it at the
            old 520px no matter how wide this wrapper grows. */}
        <div className="w-[70vw] max-w-3xl drop-shadow-xl">
          {FlipBook ? (
            <FlipBook
              ref={bookRef}
              width={320}
              height={452}
              size="stretch"
              minWidth={220}
              maxWidth={900}
              minHeight={311}
              maxHeight={1272}
              startPage={0}
              drawShadow
              flippingTime={700}
              usePortrait
              startZIndex={0}
              autoSize
              maxShadowOpacity={0.5}
              showCover={false}
              mobileScrollSupport
              clickEventForward
              useMouseEvents
              swipeDistance={30}
              showPageCorners
              disableFlipByClick={false}
              className="media-flipbook"
              style={{}}
              onFlip={(e: any) => setPageIndex(e.data)}
            >
              {items.map((item, i) => (
                <Page key={i} image={item.image} alt={item.alt} priority={i === 0} />
              ))}
            </FlipBook>
          ) : (
            <div className="flex aspect-[320/452] w-full items-center justify-center rounded bg-white/70 text-sm text-muted-soft">
              Loading…
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={next}
          disabled={pageIndex >= total - 1}
          aria-label="Next page"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-headline-green/30 text-xl text-headline-green transition-all duration-300 ease-out hover:border-terracotta hover:bg-terracotta/10 hover:text-terracotta disabled:pointer-events-none disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-ink">
        <button
          type="button"
          onClick={prev}
          disabled={pageIndex <= 0}
          className="min-h-[44px] border border-headline-green/30 px-3 py-1.5 transition-colors duration-300 ease-out hover:border-terracotta hover:text-terracotta disabled:pointer-events-none disabled:opacity-30"
        >
          ‹ Prev
        </button>
        <span className="text-muted-soft">
          {pageIndex + 1} / {total}
        </span>
        <button
          type="button"
          onClick={next}
          disabled={pageIndex >= total - 1}
          className="min-h-[44px] border border-headline-green/30 px-3 py-1.5 transition-colors duration-300 ease-out hover:border-terracotta hover:text-terracotta disabled:pointer-events-none disabled:opacity-30"
        >
          Next ›
        </button>
      </div>
      <p className="text-center text-xs text-muted-soft">Drag a corner, swipe, or use the arrows to flip through.</p>
    </div>
  );
}

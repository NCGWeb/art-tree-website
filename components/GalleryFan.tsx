'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// A tight, mostly-flat overlapping stack (like a hand of cards laid on a
// table) rather than the old wide semi-circle arc — the y-offsets stay
// small and close together instead of sweeping down toward the ends, and
// every value is a CSS clamp() so the whole stack compresses smoothly on
// narrow viewports instead of overflowing and getting clipped by the
// section's overflow-hidden.
const POSITIONS = [
  { x: 'clamp(-168px, -30vw, -108px)', y: 'clamp(14px, 3vw, 22px)', rotate: -12, z: 1, w: 'clamp(84px, 24vw, 120px)', h: 'clamp(128px, 36vw, 182px)', opacity: 0.85 },
  { x: 'clamp(-90px, -16vw, -58px)', y: 'clamp(6px, 1.5vw, 10px)', rotate: -6, z: 2, w: 'clamp(96px, 27vw, 136px)', h: 'clamp(146px, 41vw, 206px)', opacity: 1 },
  { x: '0px', y: '0px', rotate: 0, z: 5, w: 'clamp(128px, 34vw, 178px)', h: 'clamp(194px, 52vw, 270px)', opacity: 1 },
  { x: 'clamp(58px, 16vw, 90px)', y: 'clamp(6px, 1.5vw, 10px)', rotate: 6, z: 2, w: 'clamp(96px, 27vw, 136px)', h: 'clamp(146px, 41vw, 206px)', opacity: 1 },
  { x: 'clamp(108px, 30vw, 168px)', y: 'clamp(14px, 3vw, 22px)', rotate: 12, z: 1, w: 'clamp(84px, 24vw, 120px)', h: 'clamp(128px, 36vw, 182px)', opacity: 0.85 },
];

type GalleryItem = { image: string; alt: string; title: string; form: string; region: string };

export default function GalleryFan({ items }: { items: GalleryItem[] }) {
  const [cursor, setCursor] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setCursor((c) => (c + 1) % items.length);
      }
    }, 2200);
    return () => clearInterval(id);
  }, [items.length]);

  function go(dir: number) {
    setCursor((c) => (c + dir + items.length) % items.length);
  }

  // The center card (POSITIONS index 2) is always the current item —
  // its title/form/region drive the caption below, updating live as the
  // fan rotates or is navigated, matching the reference mockup.
  const current = items[cursor];

  return (
    <div className="relative mx-auto mt-4 max-w-site animate-fadeIn sm:mt-6">
      {/* Height must fully contain the tallest card's visual extent. Kept
          generous enough for the center card's clamp() max height so
          nothing bleeds into the caption/nav below at any viewport. */}
      <div
        className="relative mx-auto flex h-[225px] items-start justify-center sm:h-[310px]"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {POSITIONS.map((pos, i) => {
          // Key by the item's own index (not the fan slot i) so React keeps
          // each <button> mounted as it moves between slots — that's what
          // makes the position/rotation change animate smoothly via the
          // transition classes below instead of the image just popping.
          const idx = (cursor + i) % items.length;
          const item = items[idx];
          return (
            <button
              key={idx}
              type="button"
              aria-label={i === 2 ? undefined : 'Bring this artwork to the centre'}
              onClick={() => (i !== 2 ? go(i - 2) : undefined)}
              className="absolute left-1/2 top-2 overflow-hidden rounded-lg bg-white shadow-[0_10px_28px_rgba(60,45,20,0.22)] transition-all duration-700 ease-reveal hover:shadow-[0_16px_38px_rgba(60,45,20,0.32)] hover:brightness-105 sm:top-5"
              style={{
                width: pos.w,
                height: pos.h,
                zIndex: pos.z,
                opacity: pos.opacity,
                transform: `translateX(-50%) translate(${pos.x}, ${pos.y}) rotate(${pos.rotate}deg)`,
              }}
            >
              <Image src={item.image} alt={item.alt} fill quality={90} className="object-contain" sizes="184px" />
            </button>
          );
        })}
      </div>

      <div key={cursor} className="relative z-10 mt-5 text-center animate-fadeIn">
        <div className="font-head text-lg text-headline-green">{current.title}</div>
        <div className="text-sm text-muted-soft">
          {current.form} | {current.region}
        </div>
      </div>

      {/* Left = outlined, right = solid gold-filled, matching the mockup. */}
      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-headline-green text-headline-green transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-headline-green hover:text-white active:scale-95"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-dark active:scale-95"
        >
          ›
        </button>
      </div>
    </div>
  );
}

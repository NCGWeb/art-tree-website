'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Five tall portrait cards spread across the full width, centre one largest.
// Everything is a percentage of the stage (whose aspect ratio is fixed), so
// the whole fan scales together at any viewport width and never overflows.
// rotateY (under the stage's perspective) turns the outer cards toward the
// centre like the reference; images fill their cards edge to edge.
const POSITIONS = [
  { left: 2, top: 20, w: 17, h: 76, rotateY: 16, z: 1 },
  { left: 20.5, top: 12, w: 16.5, h: 84, rotateY: 12, z: 2 },
  { left: 38, top: 0, w: 24, h: 100, rotateY: 0, z: 5 },
  { left: 63, top: 12, w: 16.5, h: 84, rotateY: -12, z: 2 },
  { left: 81, top: 20, w: 17, h: 76, rotateY: -16, z: 1 },
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
    }, 2600);
    return () => clearInterval(id);
  }, [items.length]);

  function go(dir: number) {
    setCursor((c) => (c + dir + items.length) % items.length);
  }

  const current = items[cursor];

  return (
    <div className="relative mx-auto mt-6 w-full max-w-[1500px] animate-fadeIn px-2 sm:mt-8 sm:px-4">
      <div
        className="relative mx-auto w-full"
        style={{ aspectRatio: '823 / 360', perspective: '1400px' }}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {POSITIONS.map((pos, i) => {
          // Keyed by the item's own index so each card stays mounted while
          // it travels between slots, which is what animates the move.
          const idx = (cursor + i) % items.length;
          const item = items[idx];
          return (
            <button
              key={idx}
              type="button"
              aria-label={i === 2 ? undefined : 'Bring this artwork to the centre'}
              onClick={() => (i !== 2 ? go(i - 2) : undefined)}
              className="absolute overflow-hidden rounded-xl shadow-[0_14px_34px_rgba(60,45,20,0.28)] transition-all duration-700 ease-reveal hover:brightness-105 sm:rounded-2xl"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                width: `${pos.w}%`,
                height: `${pos.h}%`,
                zIndex: pos.z,
                transform: `rotateY(${pos.rotateY}deg)`,
              }}
            >
              <Image src={item.image} alt={item.alt} fill quality={90} className="object-cover" loading="eager" sizes="(min-width: 1280px) 24vw, 34vw" />
            </button>
          );
        })}
      </div>

      <div key={cursor} className="relative z-10 mt-6 text-center animate-fadeIn">
        <div className="text-sm font-semibold text-ink sm:text-base">{current.title}</div>
        <div className="mx-auto my-2 h-0.5 w-8 bg-gold" />
        <div className="text-xs text-muted-soft sm:text-sm">
          {current.form} | {current.region}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-headline-green transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-headline-green hover:text-white active:scale-95"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-dark active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  );
}

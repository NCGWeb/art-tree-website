'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const POSITIONS = [
  { x: -230, y: 56, rotate: -18, z: 1, w: 120, h: 184, opacity: 0.9 },
  { x: -120, y: 16, rotate: -9, z: 2, w: 136, h: 216, opacity: 1 },
  { x: 0, y: -8, rotate: 0, z: 5, w: 184, h: 280, opacity: 1 },
  { x: 120, y: 16, rotate: 9, z: 2, w: 136, h: 216, opacity: 1 },
  { x: 230, y: 56, rotate: 18, z: 1, w: 120, h: 184, opacity: 0.9 },
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
    }, 1400);
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
    <div className="relative mx-auto mt-4 max-w-site sm:mt-6">
      {/* Height must fully contain the tallest card's visual extent:
          top-5 (20px) + pos.y (-8px) + pos.h (280px) = 292px for the
          center card. Positioned elements always paint above normal-flow
          siblings regardless of z-index, so the box must be tall enough
          that the center card doesn't bleed into the caption/nav below. */}
      <div
        className="relative mx-auto flex h-[300px] items-start justify-center sm:h-[340px]"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {POSITIONS.map((pos, i) => {
          const idx = (cursor + i) % items.length;
          const item = items[idx];
          return (
            <button
              key={i}
              type="button"
              aria-label={i === 2 ? undefined : 'Bring this artwork to the centre'}
              onClick={() => (i !== 2 ? go(i - 2) : undefined)}
              className="absolute left-1/2 top-5 overflow-hidden rounded-lg bg-white shadow-[0_10px_28px_rgba(60,45,20,0.22)] transition-all duration-500 ease-out hover:shadow-[0_16px_38px_rgba(60,45,20,0.32)] hover:brightness-105"
              style={{
                width: pos.w,
                height: pos.h,
                zIndex: pos.z,
                opacity: pos.opacity,
                transform: `translate(calc(-50% + ${pos.x}px), ${pos.y}px) rotate(${pos.rotate}deg)`,
              }}
            >
              <Image src={item.image} alt={item.alt} fill quality={90} className="object-contain" sizes="184px" />
            </button>
          );
        })}
      </div>

      <div className="relative z-10 mt-5 text-center">
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-headline-green text-headline-green transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-headline-green hover:text-white"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-dark"
        >
          ›
        </button>
      </div>
    </div>
  );
}

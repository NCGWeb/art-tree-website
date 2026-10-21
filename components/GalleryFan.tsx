'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const POSITIONS = [
  { x: -290, y: 70, rotate: -18, z: 1, w: 150, h: 230, opacity: 0.9 },
  { x: -150, y: 20, rotate: -9, z: 2, w: 170, h: 270, opacity: 1 },
  { x: 0, y: -10, rotate: 0, z: 5, w: 230, h: 350, opacity: 1 },
  { x: 150, y: 20, rotate: 9, z: 2, w: 170, h: 270, opacity: 1 },
  { x: 290, y: 70, rotate: 18, z: 1, w: 150, h: 230, opacity: 0.9 },
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
    <div className="relative mx-auto mt-10 max-w-site">
      {/* Height must fully contain the tallest card's visual extent:
          top-5 (20px) + pos.y (-10px) + pos.h (350px) = 360px for the
          center card. The old h-[320px] base was 40px too short below the
          sm breakpoint (640px) — StPageFlip... no, this is GalleryFan: the
          center card visually overflowed the container by 40px and, being
          position:absolute, painted over the caption/nav-buttons below it
          and bled into the next section, since positioned elements always
          paint above normal-flow siblings regardless of z-index. */}
      <div
        className="relative mx-auto flex h-[380px] items-start justify-center sm:h-[420px]"
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
              <Image src={item.image} alt={item.alt} fill quality={90} className="object-cover" sizes="230px" />
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

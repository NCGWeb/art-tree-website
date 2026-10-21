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

export default function GalleryFan({
  images,
  captionTitle,
  captionSub,
}: {
  images: string[];
  captionTitle: string;
  captionSub: string;
}) {
  const [cursor, setCursor] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setCursor((c) => (c + 1) % images.length);
      }
    }, 1400);
    return () => clearInterval(id);
  }, [images.length]);

  function go(dir: number) {
    setCursor((c) => (c + dir + images.length) % images.length);
  }

  return (
    <div className="relative mx-auto mt-10 max-w-site">
      <div
        className="relative mx-auto flex h-[320px] items-start justify-center sm:h-[420px]"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {POSITIONS.map((pos, i) => {
          const idx = (cursor + i) % images.length;
          const src = images[idx];
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
              <Image src={src} alt="" fill className="object-cover" sizes="230px" />
            </button>
          );
        })}
      </div>
      <div className="relative z-10 mt-5 text-center">
        <div className="font-head text-lg text-headline-green">{captionTitle}</div>
        <div className="text-sm text-muted-soft">{captionSub}</div>
      </div>
      <div className="mt-3 flex justify-center gap-3">
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-headline-green text-headline-green transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-headline-green hover:text-white"
        >
          ›
        </button>
      </div>
    </div>
  );
}

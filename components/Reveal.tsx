'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Lightweight scroll-reveal wrapper used across all public pages.
 *
 * Deliberately NOT built on an animation library: it's a single
 * IntersectionObserver + a CSS class toggle (see .reveal / .reveal-visible
 * in app/globals.css). That keeps the added JS at well under 1kb and avoids
 * shipping a dependency (e.g. framer-motion) into every page just to fade
 * sections in on scroll. Only opacity/transform are animated, so it never
 * causes layout shift, and app/globals.css disables the transition entirely
 * under prefers-reduced-motion.
 */
export default function Reveal({
  children,
  as = 'div',
  className = '',
  delay = 0,
  y = 18,
  once = true,
  id,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  as?: 'div' | 'section' | 'article' | 'li' | 'span' | 'figure';
  className?: string;
  /** Stagger delay in ms, useful for sibling cards in a grid. */
  delay?: number;
  /** Starting translateY offset in px. */
  y?: number;
  once?: boolean;
  id?: string;
  'aria-label'?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms', '--reveal-y': `${y}px` }}
    >
      {children}
    </Tag>
  );
}

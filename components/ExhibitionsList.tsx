'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Modal from '@/components/Modal';
import Reveal from '@/components/Reveal';

type EventItem = {
  id: string;
  type: string;
  date: string;
  day: string;
  month: string;
  year: string;
  dow?: string;
  image: string;
  alt: string;
  category: string;
  title: string;
  meta: string;
  excerpt: string;
  modalParagraphs: string[];
};

type Option = { value: string; label: string };

export default function ExhibitionsList({
  events,
  dateOptions,
  typeOptions,
}: {
  events: EventItem[];
  dateOptions: Option[];
  typeOptions: Option[];
}) {
  const [date, setDate] = useState('all');
  const [type, setType] = useState('all');

  const filtered = useMemo(
    () =>
      events.filter((ev) => {
        const okDate = date === 'all' || ev.date === date;
        const okType = type === 'all' || ev.type === type;
        return okDate && okType;
      }),
    [events, date, type],
  );

  return (
    <>
      <section className="bg-header-bg">
        <div className="mx-auto flex max-w-site flex-wrap items-end gap-4 px-5 py-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="fDate" className="text-xs font-medium uppercase tracking-wide text-ink">
              Filter by date
            </label>
            <select
              id="fDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded border border-ink/20 bg-white px-3 py-2 text-sm text-ink transition-colors duration-300 ease-out hover:border-terracotta focus-visible:border-terracotta"
            >
              {dateOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="fType" className="text-xs font-medium uppercase tracking-wide text-ink">
              Filter by type
            </label>
            <select
              id="fType"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded border border-ink/20 bg-white px-3 py-2 text-sm text-ink transition-colors duration-300 ease-out hover:border-terracotta focus-visible:border-terracotta"
            >
              {typeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-cream/88 py-6">
        <div className="mx-auto max-w-site space-y-10 px-5">
          {filtered.map((ev, i) => (
            <Reveal
              as="article"
              key={ev.id}
              delay={Math.min(i, 4) * 70}
              className="card-hover grid grid-cols-1 gap-5 rounded-md border-b border-black/5 p-3 pb-8 last:border-b-0 sm:grid-cols-[110px_260px_1fr] sm:items-start"
            >
              <div className="flex gap-2 sm:block">
                <div className="font-head text-2xl leading-none text-headline-green">{ev.day}</div>
                <div className="text-sm text-ink">{ev.month}</div>
                <div className="font-head text-base text-terracotta">{ev.year}</div>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-cream-deep shadow">
                <Image src={ev.image} alt={ev.alt} fill quality={90} className="object-contain transition-transform duration-500 ease-out hover:scale-105" sizes="(min-width: 640px) 300px, 90vw" />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-tan">{ev.category}</div>
                <h3 className="mb-1.5 font-head text-xl text-headline-green">{ev.title}</h3>
                <div className="mb-2 text-xs text-muted-soft">{ev.meta}</div>
                <p className="mb-3 text-sm leading-relaxed text-muted">{ev.excerpt}</p>
                <Modal title={ev.title} paragraphs={ev.modalParagraphs} buttonLabel="Details" />
              </div>
            </Reveal>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-soft">No events match these filters.</p>
          )}
        </div>
      </section>
    </>
  );
}

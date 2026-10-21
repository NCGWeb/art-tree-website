'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Modal from '@/components/Modal';

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
              className="rounded border border-ink/20 bg-white px-3 py-2 text-sm text-ink"
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
              className="rounded border border-ink/20 bg-white px-3 py-2 text-sm text-ink"
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

      <section className="bg-cream py-6">
        <div className="mx-auto max-w-site space-y-10 px-5">
          {filtered.map((ev) => (
            <article key={ev.id} className="grid grid-cols-1 gap-5 border-b border-black/5 pb-8 last:border-b-0 sm:grid-cols-[110px_260px_1fr] sm:items-start">
              <div className="flex gap-2 sm:block">
                <div className="font-head text-2xl leading-none text-headline-green">{ev.day}</div>
                <div className="text-sm text-ink">{ev.month}</div>
                <div className="font-head text-base text-terracotta">{ev.year}</div>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded shadow">
                <Image src={ev.image} alt={ev.alt} fill className="object-cover" sizes="260px" />
              </div>
              <div>
                <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-tan">{ev.category}</div>
                <h3 className="mb-1.5 font-head text-xl text-headline-green">{ev.title}</h3>
                <div className="mb-2 text-xs text-[#6a674f]">{ev.meta}</div>
                <p className="mb-3 text-sm leading-relaxed text-[#4a473c]">{ev.excerpt}</p>
                <Modal title={ev.title} paragraphs={ev.modalParagraphs} buttonLabel="Details" />
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-[#6a674f]">No events match these filters.</p>
          )}
        </div>
      </section>
    </>
  );
}

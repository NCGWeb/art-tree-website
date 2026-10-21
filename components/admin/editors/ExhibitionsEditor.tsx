'use client';

import { useState } from 'react';
import SaveBar from '@/components/admin/SaveBar';
import { TextField, TextAreaField, ParagraphListField } from '@/components/admin/Field';
import { ImageField } from '@/components/admin/ImageField';
import CardList from '@/components/admin/CardList';

export default function ExhibitionsEditor({ initial }: { initial: any }) {
  const [data, setData] = useState<any>(initial);

  function set(path: string[], value: any) {
    setData((prev: any) => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  }

  async function handleSave() {
    const res = await fetch('/api/admin/content/exhibitions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Save failed');
    }
  }

  return (
    <div>
      <SaveBar title="Exhibitions Page" liveHref="/exhibitions" onSave={handleSave} />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Hero</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.hero.eyebrow} onChange={(v) => set(['hero', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.hero.heading} onChange={(v) => set(['hero', 'heading'], v)} />
            <TextAreaField label="Lead paragraph" value={data.hero.lead} onChange={(v) => set(['hero', 'lead'], v)} rows={2} />
            <TextAreaField label="Quote" value={data.hero.quote} onChange={(v) => set(['hero', 'quote'], v)} rows={2} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Current show (pinned at the top)</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <TextField label="Day" value={data.current.day} onChange={(v) => set(['current', 'day'], v)} />
              <TextField label="Month" value={data.current.month} onChange={(v) => set(['current', 'month'], v)} />
              <TextField label="Year" value={data.current.year} onChange={(v) => set(['current', 'year'], v)} />
            </div>
            <ImageField
              label="Image"
              src={data.current.image}
              alt={data.current.alt}
              onSrcChange={(v) => set(['current', 'image'], v)}
              onAltChange={(v) => set(['current', 'alt'], v)}
            />
            <TextField label="Category label" value={data.current.category} onChange={(v) => set(['current', 'category'], v)} />
            <TextField label="Title" value={data.current.title} onChange={(v) => set(['current', 'title'], v)} />
            <TextField label="Meta (dates / venue)" value={data.current.meta} onChange={(v) => set(['current', 'meta'], v)} />
            <ParagraphListField label="Paragraphs" value={data.current.paragraphs} onChange={(v) => set(['current', 'paragraphs'], v)} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Date filter options</h2>
          <CardList
            items={data.filters.dates}
            onChange={(v) => set(['filters', 'dates'], v)}
            newItem={() => ({ value: '', label: '' })}
            addLabel="+ Add date option"
            itemLabel={(item: any) => item.label || 'Option'}
            renderItem={(item: any, update) => (
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Value (e.g. 2023-11)" value={item.value} onChange={(v) => update({ value: v })} />
                <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
              </div>
            )}
          />
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Events list</h2>
          <CardList
            items={data.events}
            onChange={(v) => set(['events'], v)}
            newItem={() => ({
              id: `event-${Date.now()}`,
              type: 'shows',
              date: '',
              day: '',
              month: '',
              year: '',
              image: '',
              alt: '',
              category: 'Shows',
              title: '',
              meta: '',
              excerpt: '',
              modalParagraphs: [''],
            })}
            addLabel="+ Add event"
            itemLabel={(item: any) => item.title || 'Event'}
            renderItem={(item: any, update) => (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <TextField label="Day" value={item.day} onChange={(v) => update({ day: v })} />
                  <TextField label="Month" value={item.month} onChange={(v) => update({ month: v })} />
                  <TextField label="Year" value={item.year} onChange={(v) => update({ year: v })} />
                  <TextField label="Filter date (YYYY-MM)" value={item.date} onChange={(v) => update({ date: v })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-ink">Type</span>
                    <select
                      value={item.type}
                      onChange={(e) => update({ type: e.target.value })}
                      className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink"
                    >
                      <option value="shows">Shows</option>
                      <option value="talks">Talks</option>
                    </select>
                  </label>
                  <TextField label="Category label" value={item.category} onChange={(v) => update({ category: v })} />
                </div>
                <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                <TextField label="Meta (dates / venue)" value={item.meta} onChange={(v) => update({ meta: v })} />
                <ImageField
                  label="Thumbnail"
                  src={item.image}
                  alt={item.alt}
                  onSrcChange={(v) => update({ image: v })}
                  onAltChange={(v) => update({ alt: v })}
                />
                <TextAreaField label="Short excerpt (shown on the page)" value={item.excerpt} onChange={(v) => update({ excerpt: v })} rows={3} />
                <ParagraphListField
                  label="'Details' popup text"
                  value={item.modalParagraphs}
                  onChange={(v) => update({ modalParagraphs: v })}
                />
              </>
            )}
          />
        </section>
      </div>
    </div>
  );
}

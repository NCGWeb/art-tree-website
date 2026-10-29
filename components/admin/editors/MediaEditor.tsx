'use client';

import { useState } from 'react';
import SaveBar from '@/components/admin/SaveBar';
import { TextField, TextAreaField } from '@/components/admin/Field';
import CardList from '@/components/admin/CardList';
import { ImageField } from '@/components/admin/ImageField';

export default function MediaEditor({ initial }: { initial: any }) {
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
    const res = await fetch('/api/admin/content/media', {
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
      <SaveBar title="Media Page" liveHref="/media" onSave={handleSave} />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Hero</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.hero.eyebrow} onChange={(v) => set(['hero', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.hero.heading} onChange={(v) => set(['hero', 'heading'], v)} />
            <TextAreaField label="Lead paragraph" value={data.hero.lead} onChange={(v) => set(['hero', 'lead'], v)} rows={2} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Press coverage pages</h2>
          <p className="mb-3 text-sm text-[#6a674f]">
            Each item below is one page of the flipbook, in the order visitors will see them.
          </p>
          <CardList
            items={data.items}
            onChange={(v) => set(['items'], v)}
            newItem={() => ({ image: '', alt: '', event: '', publication: '', date: '', url: '' })}
            addLabel="+ Add page"
            itemLabel={(item: any, i: number) => `Page ${i + 1}${item.publication ? ` · ${item.publication}` : ''}`}
            renderItem={(item: any, update) => (
              <div className="space-y-3">
                <ImageField
                  label="Page image"
                  src={item.image}
                  alt={item.alt}
                  onSrcChange={(v) => update({ image: v })}
                  onAltChange={(v) => update({ alt: v })}
                />
                <TextField label="Event (as named on the Exhibitions page, shown under the book)" value={item.event || ''} onChange={(v) => update({ event: v })} />
                <TextField label="Publication (shown under the book)" value={item.publication || ''} onChange={(v) => update({ publication: v })} />
                <TextField label="Date, YYYY-MM-DD (shown under the book)" value={item.date || ''} onChange={(v) => update({ date: v })} />
                <TextField label="Article link (adds a Read article button, leave empty for print clippings)" value={item.url || ''} onChange={(v) => update({ url: v })} />
              </div>
            )}
          />
        </section>
      </div>
    </div>
  );
}

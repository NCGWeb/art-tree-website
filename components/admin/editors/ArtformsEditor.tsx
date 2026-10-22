'use client';

import { useState } from 'react';
import SaveBar from '@/components/admin/SaveBar';
import { TextField, TextAreaField, ParagraphListField } from '@/components/admin/Field';
import { ImageField } from '@/components/admin/ImageField';
import CardList from '@/components/admin/CardList';

export default function ArtformsEditor({ initial }: { initial: any }) {
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
    const res = await fetch('/api/admin/content/artforms', {
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
      <SaveBar title="Art Forms Page" liveHref="/artforms" onSave={handleSave} />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Hero</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.hero.eyebrow} onChange={(v) => set(['hero', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.hero.heading} onChange={(v) => set(['hero', 'heading'], v)} />
            <TextAreaField label="Lead paragraph" value={data.hero.lead} onChange={(v) => set(['hero', 'lead'], v)} rows={3} />
            <ImageField
              label="Background image (optional)"
              src={data.hero.image}
              alt={data.hero.alt}
              onSrcChange={(v) => set(['hero', 'image'], v)}
              onAltChange={(v) => set(['hero', 'alt'], v)}
            />
            <p className="text-xs text-muted-soft">
              Leave empty to keep the plain background colour. Add an image to show it full-width behind the heading, like the Exhibitions and Contact pages.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Art forms</h2>
          <CardList
            items={data.artforms}
            onChange={(v) => set(['artforms'], v)}
            newItem={() => ({ id: `artform-${Date.now()}`, title: '', credit: '', subtitle: '', excerpt: '', image: '', alt: '', modalParagraphs: [''] })}
            addLabel="+ Add art form"
            itemLabel={(item: any) => item.title || 'Art form'}
            renderItem={(item: any, update) => (
              <>
                <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                <TextField label="Artist credit (shown above the title, e.g. Gond Art by Durga Bai)" value={item.credit || ''} onChange={(v) => update({ credit: v })} />
                <TextField label="Subtitle (region · description)" value={item.subtitle} onChange={(v) => update({ subtitle: v })} />
                <ImageField
                  label="Image (leave empty to show a placeholder)"
                  src={item.image}
                  alt={item.alt}
                  onSrcChange={(v) => update({ image: v })}
                  onAltChange={(v) => update({ alt: v })}
                />
                <TextAreaField label="Short excerpt (shown on the page)" value={item.excerpt} onChange={(v) => update({ excerpt: v })} rows={3} />
                <ParagraphListField
                  label="'Read more' popup text"
                  value={item.modalParagraphs}
                  onChange={(v) => update({ modalParagraphs: v })}
                />
              </>
            )}
          />
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Cultural Baithaks &amp; Talks</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.programmes.eyebrow} onChange={(v) => set(['programmes', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.programmes.heading} onChange={(v) => set(['programmes', 'heading'], v)} />
            <TextAreaField label="Intro paragraph" value={data.programmes.intro} onChange={(v) => set(['programmes', 'intro'], v)} rows={3} />
            <CardList
              items={data.programmes.cards}
              onChange={(v) => set(['programmes', 'cards'], v)}
              newItem={() => ({ title: '', withLabel: '', text: '' })}
              addLabel="+ Add programme"
              itemLabel={(item: any) => item.title || 'Programme'}
              renderItem={(item: any, update) => (
                <>
                  <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                  <TextField label="'With' line" value={item.withLabel} onChange={(v) => update({ withLabel: v })} />
                  <TextAreaField label="Text" value={item.text} onChange={(v) => update({ text: v })} rows={3} />
                </>
              )}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

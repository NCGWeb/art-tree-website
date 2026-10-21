'use client';

import { useState } from 'react';
import SaveBar from '@/components/admin/SaveBar';
import { TextField, TextAreaField, ParagraphListField } from '@/components/admin/Field';
import { ImageField } from '@/components/admin/ImageField';
import CardList from '@/components/admin/CardList';

export default function AboutEditor({ initial }: { initial: any }) {
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
    const res = await fetch('/api/admin/content/about', {
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
      <SaveBar title="About Page" liveHref="/about" onSave={handleSave} />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Hero</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.hero.eyebrow} onChange={(v) => set(['hero', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.hero.heading} onChange={(v) => set(['hero', 'heading'], v)} />
            <TextAreaField label="Lead paragraph" value={data.hero.lead} onChange={(v) => set(['hero', 'lead'], v)} rows={2} />
            <TextAreaField label="Quote" value={data.hero.quote} onChange={(v) => set(['hero', 'quote'], v)} rows={2} />
            <TextField label="Quote attribution" value={data.hero.quoteAttribution} onChange={(v) => set(['hero', 'quoteAttribution'], v)} />
            <ImageField
              label="Hero image"
              src={data.hero.image}
              alt={data.hero.alt}
              onSrcChange={(v) => set(['hero', 'image'], v)}
              onAltChange={(v) => set(['hero', 'alt'], v)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Our Story</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.story.eyebrow} onChange={(v) => set(['story', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.story.heading} onChange={(v) => set(['story', 'heading'], v)} />
            <ParagraphListField label="Paragraphs" value={data.story.paragraphs} onChange={(v) => set(['story', 'paragraphs'], v)} />
            <ImageField
              label="Photo"
              src={data.story.image}
              alt={data.story.alt}
              onSrcChange={(v) => set(['story', 'image'], v)}
              onAltChange={(v) => set(['story', 'alt'], v)}
            />
            <TextField label="Button label" value={data.story.buttonLabel} onChange={(v) => set(['story', 'buttonLabel'], v)} />
            <ParagraphListField
              label="'Read more' popup text"
              value={data.story.modalParagraphs}
              onChange={(v) => set(['story', 'modalParagraphs'], v)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">What We Do</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.whatWeDo.eyebrow} onChange={(v) => set(['whatWeDo', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.whatWeDo.heading} onChange={(v) => set(['whatWeDo', 'heading'], v)} />
            <TextAreaField label="Intro" value={data.whatWeDo.intro} onChange={(v) => set(['whatWeDo', 'intro'], v)} rows={2} />
            <ImageField
              label="Photo"
              src={data.whatWeDo.image}
              alt={data.whatWeDo.alt}
              onSrcChange={(v) => set(['whatWeDo', 'image'], v)}
              onAltChange={(v) => set(['whatWeDo', 'alt'], v)}
            />
            <CardList
              items={data.whatWeDo.items}
              onChange={(v) => set(['whatWeDo', 'items'], v)}
              newItem={() => ({ icon: 'exhibitions', title: '', text: '' })}
              addLabel="+ Add item"
              itemLabel={(item: any) => item.title || 'Item'}
              renderItem={(item: any, update) => (
                <>
                  <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                  <TextAreaField label="Text" value={item.text} onChange={(v) => update({ text: v })} rows={2} />
                </>
              )}
            />
            <ParagraphListField
              label="'Read more' popup text"
              value={data.whatWeDo.modalParagraphs}
              onChange={(v) => set(['whatWeDo', 'modalParagraphs'], v)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Philosophy</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.philosophy.eyebrow} onChange={(v) => set(['philosophy', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.philosophy.heading} onChange={(v) => set(['philosophy', 'heading'], v)} />
            <TextAreaField label="Paragraph" value={data.philosophy.paragraph} onChange={(v) => set(['philosophy', 'paragraph'], v)} rows={2} />
            <TextField label="Button label" value={data.philosophy.buttonLabel} onChange={(v) => set(['philosophy', 'buttonLabel'], v)} />
            <TextAreaField label="Quote" value={data.philosophy.quote} onChange={(v) => set(['philosophy', 'quote'], v)} rows={2} />
            <ParagraphListField
              label="'Our Impact' popup text"
              value={data.philosophy.modalParagraphs}
              onChange={(v) => set(['philosophy', 'modalParagraphs'], v)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

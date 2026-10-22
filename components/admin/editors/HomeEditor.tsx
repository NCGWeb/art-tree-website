'use client';

import { useState } from 'react';
import SaveBar from '@/components/admin/SaveBar';
import { TextField, TextAreaField, ParagraphListField, SelectField } from '@/components/admin/Field';
import { ImageField } from '@/components/admin/ImageField';
import CardList from '@/components/admin/CardList';

export default function HomeEditor({ initial }: { initial: any }) {
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
    const res = await fetch('/api/admin/content/home', {
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
      <SaveBar title="Home Page" liveHref="/" onSave={handleSave} />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Hero</h2>
          <div className="space-y-3">
            <ImageField
              label="Hero image"
              src={data.hero.image}
              alt={data.hero.alt}
              onSrcChange={(v) => set(['hero', 'image'], v)}
              onAltChange={(v) => set(['hero', 'alt'], v)}
            />
            <SelectField
              label="Desktop/laptop height"
              value={data.hero.desktopHeight ?? 'full'}
              onChange={(v) => set(['hero', 'desktopHeight'], v)}
              options={[
                { value: 'full', label: 'Full image (no cropping)' },
                { value: '440px', label: 'Compact (440px)' },
                { value: '550px', label: 'Medium (550px)' },
                { value: '660px', label: 'Tall (660px)' },
              ]}
            />
            <p className="text-xs text-muted-soft">
              Mobile always shows the full hero image. This only controls how tall it appears on laptop/desktop screens.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">&ldquo;A Record of How People Lived&rdquo; section</h2>
          <div className="space-y-3">
            <TextField label="Heading" value={data.record.heading} onChange={(v) => set(['record', 'heading'], v)} />
            <TextAreaField label="Paragraph" value={data.record.paragraph} onChange={(v) => set(['record', 'paragraph'], v)} />
            <ImageField
              label="Photo"
              src={data.record.image}
              alt={data.record.alt}
              onSrcChange={(v) => set(['record', 'image'], v)}
              onAltChange={(v) => set(['record', 'alt'], v)}
            />
            <TextField label="Button label" value={data.record.buttonLabel} onChange={(v) => set(['record', 'buttonLabel'], v)} />
            <ParagraphListField
              label="'Read more' popup text"
              value={data.record.modalParagraphs}
              onChange={(v) => set(['record', 'modalParagraphs'], v)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Stats bar</h2>
          <CardList
            items={data.stats}
            onChange={(v) => set(['stats'], v)}
            newItem={() => ({ number: '', label: '', sub: '' })}
            addLabel="+ Add stat"
            itemLabel={(item: any) => item.label || 'Stat'}
            renderItem={(item: any, update) => (
              <>
                <TextField label="Number" value={item.number} onChange={(v) => update({ number: v })} />
                <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                <TextField label="Subtext" value={item.sub} onChange={(v) => update({ sub: v })} />
              </>
            )}
          />
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">&ldquo;A canvas as large as India itself&rdquo; section</h2>
          <div className="space-y-3">
            <TextField label="Heading" value={data.canvas.heading} onChange={(v) => set(['canvas', 'heading'], v)} />
            <ParagraphListField label="Paragraphs" value={data.canvas.paragraphs} onChange={(v) => set(['canvas', 'paragraphs'], v)} />
            <ImageField
              label="Photo"
              src={data.canvas.image}
              alt={data.canvas.alt}
              onSrcChange={(v) => set(['canvas', 'image'], v)}
              onAltChange={(v) => set(['canvas', 'alt'], v)}
            />
            <TextField label="Button label" value={data.canvas.buttonLabel} onChange={(v) => set(['canvas', 'buttonLabel'], v)} />
            <ParagraphListField
              label="'Discover our story' popup text"
              value={data.canvas.modalParagraphs}
              onChange={(v) => set(['canvas', 'modalParagraphs'], v)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">&ldquo;What we do&rdquo; cards</h2>
          <TextField label="Section heading" value={data.whatWeDo.heading} onChange={(v) => set(['whatWeDo', 'heading'], v)} />
          <div className="mt-3">
            <CardList
              items={data.whatWeDo.items}
              onChange={(v) => set(['whatWeDo', 'items'], v)}
              newItem={() => ({ icon: 'exhibitions', title: '', text: '', linkLabel: '', linkHref: '/' })}
              addLabel="+ Add card"
              itemLabel={(item: any) => item.title || 'Card'}
              renderItem={(item: any, update) => (
                <>
                  <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                  <TextAreaField label="Text" value={item.text} onChange={(v) => update({ text: v })} rows={2} />
                  <TextField label="Link label" value={item.linkLabel} onChange={(v) => update({ linkLabel: v })} />
                  <TextField label="Link URL" value={item.linkHref} onChange={(v) => update({ linkHref: v })} />
                </>
              )}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Our Philosophy panel</h2>
          <div className="space-y-3">
            <TextField label="Heading" value={data.philosophy.heading} onChange={(v) => set(['philosophy', 'heading'], v)} />
            <TextAreaField label="Paragraph" value={data.philosophy.paragraph} onChange={(v) => set(['philosophy', 'paragraph'], v)} />
            <ImageField
              label="Photo"
              src={data.philosophy.image}
              alt={data.philosophy.alt}
              onSrcChange={(v) => set(['philosophy', 'image'], v)}
              onAltChange={(v) => set(['philosophy', 'alt'], v)}
            />
            <TextField label="Button label" value={data.philosophy.buttonLabel} onChange={(v) => set(['philosophy', 'buttonLabel'], v)} />
            <ParagraphListField
              label="'Read our philosophy' popup text"
              value={data.philosophy.modalParagraphs}
              onChange={(v) => set(['philosophy', 'modalParagraphs'], v)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Guided by expertise panel</h2>
          <div className="space-y-3">
            <TextField label="Heading" value={data.expertise.heading} onChange={(v) => set(['expertise', 'heading'], v)} />
            <TextAreaField label="Paragraph" value={data.expertise.paragraph} onChange={(v) => set(['expertise', 'paragraph'], v)} />
            <ImageField
              label="Portrait photo"
              src={data.expertise.image}
              alt={data.expertise.alt}
              onSrcChange={(v) => set(['expertise', 'image'], v)}
              onAltChange={(v) => set(['expertise', 'alt'], v)}
            />
            <TextField label="Button label" value={data.expertise.buttonLabel} onChange={(v) => set(['expertise', 'buttonLabel'], v)} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Footer quote banner</h2>
          <TextAreaField label="Banner text" value={data.footerBanner} onChange={(v) => set(['footerBanner'], v)} />
        </section>
      </div>
    </div>
  );
}

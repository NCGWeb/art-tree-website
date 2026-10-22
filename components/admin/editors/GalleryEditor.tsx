'use client';

import { useState } from 'react';
import SaveBar from '@/components/admin/SaveBar';
import { TextField, TextAreaField } from '@/components/admin/Field';
import { ImageField } from '@/components/admin/ImageField';
import CardList from '@/components/admin/CardList';

export default function GalleryEditor({ initial }: { initial: any }) {
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
    const res = await fetch('/api/admin/content/gallery', {
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
      <SaveBar title="Gallery Page" liveHref="/gallery" onSave={handleSave} />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Hero</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.hero.eyebrow} onChange={(v) => set(['hero', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.hero.heading} onChange={(v) => set(['hero', 'heading'], v)} />
            <TextAreaField label="Lead paragraph" value={data.hero.lead} onChange={(v) => set(['hero', 'lead'], v)} rows={2} />
            <TextField label="Explore button label" value={data.hero.exploreLabel} onChange={(v) => set(['hero', 'exploreLabel'], v)} />
            <ImageField
              label="Decorative branch image (top-right of hero; works best as a transparent PNG)"
              src={data.hero.birdImage}
              onSrcChange={(v) => set(['hero', 'birdImage'], v)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Carousel</h2>
          <p className="mb-3 text-xs text-muted-soft">
            Each card shows its own title, art form and region as it rotates through the fan.
          </p>
          <CardList
            items={data.carousel.items}
            onChange={(v) => set(['carousel', 'items'], v)}
            newItem={() => ({ title: '', form: '', region: '', image: '', alt: '' })}
            addLabel="+ Add artwork"
            itemLabel={(item: any) => item.title || 'Artwork'}
            renderItem={(item: any, update) => (
              <>
                <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                <TextField label="Art form" value={item.form} onChange={(v) => update({ form: v })} />
                <TextField label="Region" value={item.region} onChange={(v) => update({ region: v })} />
                <ImageField
                  label="Image"
                  src={item.image}
                  alt={item.alt}
                  onSrcChange={(v) => update({ image: v })}
                  onAltChange={(v) => update({ alt: v })}
                />
              </>
            )}
          />
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Our Collection</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.collection.eyebrow} onChange={(v) => set(['collection', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.collection.heading} onChange={(v) => set(['collection', 'heading'], v)} />
            <TextAreaField label="Paragraph" value={data.collection.paragraph} onChange={(v) => set(['collection', 'paragraph'], v)} rows={3} />
            <TextField label="Button label" value={data.collection.ctaLabel} onChange={(v) => set(['collection', 'ctaLabel'], v)} />
            <TextField label="Button link" value={data.collection.ctaHref} onChange={(v) => set(['collection', 'ctaHref'], v)} />
            <TextAreaField label="Quote" value={data.collection.quote} onChange={(v) => set(['collection', 'quote'], v)} rows={2} />
            <ImageField
              label="Lotus plant artwork (between the text and quote; works best as a transparent PNG)"
              src={data.collection.decorImage}
              onSrcChange={(v) => set(['collection', 'decorImage'], v)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Featured Artworks</h2>
          <div className="mb-3 space-y-3">
            <TextField label="Eyebrow" value={data.featured.eyebrow} onChange={(v) => set(['featured', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.featured.heading} onChange={(v) => set(['featured', 'heading'], v)} />
            <TextField label="'View all' label" value={data.featured.viewAllLabel} onChange={(v) => set(['featured', 'viewAllLabel'], v)} />
            <TextField label="'View all' link" value={data.featured.viewAllHref} onChange={(v) => set(['featured', 'viewAllHref'], v)} />
          </div>
          <CardList
            items={data.featured.items}
            onChange={(v) => set(['featured', 'items'], v)}
            newItem={() => ({ title: '', form: '', region: '', image: '', alt: '' })}
            addLabel="+ Add artwork"
            itemLabel={(item: any) => item.title || 'Artwork'}
            renderItem={(item: any, update) => (
              <>
                <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
                <TextField label="Art form" value={item.form} onChange={(v) => update({ form: v })} />
                <TextField label="Region" value={item.region} onChange={(v) => update({ region: v })} />
                <ImageField
                  label="Image"
                  src={item.image}
                  alt={item.alt}
                  onSrcChange={(v) => update({ image: v })}
                  onAltChange={(v) => update({ alt: v })}
                />
              </>
            )}
          />
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Quote Banner</h2>
          <TextAreaField
            label="Quote (shown between the flanking lotus graphics, above the footer)"
            value={data.quoteBanner}
            onChange={(v) => set(['quoteBanner'], v)}
            rows={2}
          />
        </section>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import SaveBar from '@/components/admin/SaveBar';
import { TextField, TextAreaField, StringListField } from '@/components/admin/Field';
import { ImageField } from '@/components/admin/ImageField';

export default function ContactEditor({ initial }: { initial: any }) {
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
    const res = await fetch('/api/admin/content/contact', {
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
      <SaveBar title="Contact Page" liveHref="/contact" onSave={handleSave} />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Hero</h2>
          <div className="space-y-3">
            <TextField label="Eyebrow" value={data.hero.eyebrow} onChange={(v) => set(['hero', 'eyebrow'], v)} />
            <TextField label="Heading" value={data.hero.heading} onChange={(v) => set(['hero', 'heading'], v)} />
            <TextAreaField label="Lead paragraph" value={data.hero.lead} onChange={(v) => set(['hero', 'lead'], v)} rows={2} />
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
          <h2 className="mb-3 font-head text-lg text-headline-green">Contact details</h2>
          <div className="space-y-3">
            <TextField label="Phone number" value={data.phone} onChange={(v) => set(['phone'], v)} />
            <StringListField label="Email addresses shown on the page" value={data.emails} onChange={(v) => set(['emails'], v)} />
            <TextField
              label="Email the contact form sends to"
              value={data.recipientEmail}
              onChange={(v) => set(['recipientEmail'], v)}
            />
            <TextField label="Location" value={data.location} onChange={(v) => set(['location'], v)} />
            <TextField label="Location note" value={data.locationNote} onChange={(v) => set(['locationNote'], v)} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Social links</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField label="Twitter / X URL" value={data.socials.twitter} onChange={(v) => set(['socials', 'twitter'], v)} />
            <TextField label="YouTube URL" value={data.socials.youtube} onChange={(v) => set(['socials', 'youtube'], v)} />
            <TextField label="Facebook URL" value={data.socials.facebook} onChange={(v) => set(['socials', 'facebook'], v)} />
            <TextField label="Instagram URL" value={data.socials.instagram} onChange={(v) => set(['socials', 'instagram'], v)} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Founder</h2>
          <div className="space-y-3">
            <TextField label="Name" value={data.founder.name} onChange={(v) => set(['founder', 'name'], v)} />
            <TextField label="Role" value={data.founder.role} onChange={(v) => set(['founder', 'role'], v)} />
            <TextAreaField label="Quote" value={data.founder.quote} onChange={(v) => set(['founder', 'quote'], v)} rows={2} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Message form text</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField label="Form heading" value={data.form.heading} onChange={(v) => set(['form', 'heading'], v)} />
            <TextField label="Submit button label" value={data.form.submitLabel} onChange={(v) => set(['form', 'submitLabel'], v)} />
            <TextField label="Name field label" value={data.form.nameLabel} onChange={(v) => set(['form', 'nameLabel'], v)} />
            <TextField label="Email field label" value={data.form.emailLabel} onChange={(v) => set(['form', 'emailLabel'], v)} />
            <TextField label="Subject field label" value={data.form.subjectLabel} onChange={(v) => set(['form', 'subjectLabel'], v)} />
            <TextField label="Message field label" value={data.form.messageLabel} onChange={(v) => set(['form', 'messageLabel'], v)} />
            <TextField label="Default subject (when left blank)" value={data.form.defaultSubject} onChange={(v) => set(['form', 'defaultSubject'], v)} />
          </div>
        </section>
      </div>
    </div>
  );
}

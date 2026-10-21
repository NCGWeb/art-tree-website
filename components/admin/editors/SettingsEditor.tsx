'use client';

import { useState } from 'react';
import SaveBar from '@/components/admin/SaveBar';
import { TextField } from '@/components/admin/Field';
import CardList from '@/components/admin/CardList';

export default function SettingsEditor({ initial }: { initial: any }) {
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
    const res = await fetch('/api/admin/content/site', {
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
      <SaveBar title="Site Settings" liveHref="/" onSave={handleSave} />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">General</h2>
          <div className="space-y-3">
            <TextField label="Logo alt text" value={data.logoAlt} onChange={(v) => set(['logoAlt'], v)} />
            <TextField label="Tagline (shown next to the logo)" value={data.tagline} onChange={(v) => set(['tagline'], v)} />
            <TextField
              label="WhatsApp number (digits only, with country code, e.g. 919811152110)"
              value={data.whatsappNumber}
              onChange={(v) => set(['whatsappNumber'], v)}
            />
            <TextField label="Copyright name" value={data.copyrightName} onChange={(v) => set(['copyrightName'], v)} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Main navigation</h2>
          <CardList
            items={data.nav}
            onChange={(v) => set(['nav'], v)}
            newItem={() => ({ label: '', href: '/' })}
            addLabel="+ Add nav link"
            itemLabel={(item: any) => item.label || 'Link'}
            renderItem={(item: any, update) => (
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                <TextField label="URL" value={item.href} onChange={(v) => update({ href: v })} />
              </div>
            )}
          />
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Footer</h2>
          <div className="mb-3 space-y-3">
            <TextField label="Footer tagline" value={data.footerTagline} onChange={(v) => set(['footerTagline'], v)} />
          </div>
          <CardList
            items={data.footerNav}
            onChange={(v) => set(['footerNav'], v)}
            newItem={() => ({ label: '', href: '/' })}
            addLabel="+ Add footer link"
            itemLabel={(item: any) => item.label || 'Link'}
            renderItem={(item: any, update) => (
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                <TextField label="URL" value={item.href} onChange={(v) => update({ href: v })} />
              </div>
            )}
          />
        </section>

        <section>
          <h2 className="mb-3 font-head text-lg text-headline-green">Social links</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField label="Instagram URL" value={data.socials.instagram} onChange={(v) => set(['socials', 'instagram'], v)} />
            <TextField label="Facebook URL" value={data.socials.facebook} onChange={(v) => set(['socials', 'facebook'], v)} />
            <TextField label="YouTube URL" value={data.socials.youtube} onChange={(v) => set(['socials', 'youtube'], v)} />
            <TextField label="Twitter / X URL" value={data.socials.twitter} onChange={(v) => set(['socials', 'twitter'], v)} />
          </div>
        </section>
      </div>
    </div>
  );
}

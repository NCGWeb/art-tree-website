'use client';

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        type="text"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <textarea
        value={value ?? ''}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
      />
    </label>
  );
}

export function StringListField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const items = value ?? [];

  function update(i: number, text: string) {
    const next = [...items];
    next[i] = text;
    onChange(next);
  }
  function add() {
    onChange([...items, '']);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={it}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
              className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 rounded border border-headline-green px-3 py-1.5 text-xs uppercase tracking-wide text-headline-green hover:bg-headline-green hover:text-white"
      >
        + Add
      </button>
    </div>
  );
}

export function ParagraphListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const paragraphs = value ?? [];

  function update(i: number, text: string) {
    const next = [...paragraphs];
    next[i] = text;
    onChange(next);
  }
  function add() {
    onChange([...paragraphs, '']);
  }
  function remove(i: number) {
    onChange(paragraphs.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div className="space-y-2">
        {paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={p}
              rows={3}
              onChange={(e) => update(i, e.target.value)}
              className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 self-start rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 rounded border border-headline-green px-3 py-1.5 text-xs uppercase tracking-wide text-headline-green hover:bg-headline-green hover:text-white"
      >
        + Add paragraph
      </button>
    </div>
  );
}

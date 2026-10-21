'use client';

export default function CardList<T>({
  items,
  onChange,
  newItem,
  addLabel = '+ Add item',
  renderItem,
  itemLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel?: string;
  itemLabel?: (item: T, index: number) => string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
}) {
  function update(index: number, patch: Partial<T>) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function add() {
    onChange([...items, newItem()]);
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded border border-black/10 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-tan">
              {itemLabel ? itemLabel(item, i) : `Item ${i + 1}`}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded border border-black/15 px-2 py-1 text-xs disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="rounded border border-black/15 px-2 py-1 text-xs disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="space-y-3">{renderItem(item, (patch) => update(i, patch), i)}</div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded border border-headline-green px-3 py-2 text-xs uppercase tracking-wide text-headline-green hover:bg-headline-green hover:text-white"
      >
        {addLabel}
      </button>
    </div>
  );
}

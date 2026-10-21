import { NextRequest, NextResponse } from 'next/server';
import { PAGE_SEEDS, PageKey, getPageContent } from '@/lib/content';
import { savePageContentBlob } from '@/lib/blob';

export const runtime = 'nodejs';

function isPageKey(value: string): value is PageKey {
  return Object.prototype.hasOwnProperty.call(PAGE_SEEDS, value);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { page: string } },
) {
  if (!isPageKey(params.page)) {
    return NextResponse.json({ error: 'Unknown page' }, { status: 404 });
  }
  const data = await getPageContent(params.page);
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { page: string } },
) {
  if (!isPageKey(params.page)) {
    return NextResponse.json({ error: 'Unknown page' }, { status: 404 });
  }

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
  }

  try {
    await savePageContentBlob(params.page, data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[content save] failed:', err);
    const message = err instanceof Error ? err.message : 'Save failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { uploadImageBlob } from '@/lib/blob';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files can be uploaded' },
        { status: 400 },
      );
    }

    const blob = await uploadImageBlob(file);
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('[upload] failed:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const runtime = 'nodejs';

// Vercel's serverless functions cap a request body at 4.5MB, so routing an
// admin's image upload through this route as multipart form data (the old
// approach) fails for any larger file with a non-JSON "Request Entity Too
// Large" response that broke the admin UI's `res.json()` call. Client
// uploads sidestep that: the browser uploads the file bytes straight to
// Blob storage, and this route only ever handles small JSON handshake
// requests (issuing a short-lived upload token, then an optional
// completion webhook), neither of which comes near that limit.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ['image/*'],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error('[upload] failed:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

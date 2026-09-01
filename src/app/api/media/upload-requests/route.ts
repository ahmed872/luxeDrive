import { NextResponse } from 'next/server';

import { toAppError } from '@/modules/core';
import { requestUpload } from '@/modules/media';

/**
 * "Client → request signed upload" (P04). Validates the *declared*
 * content-type/size and rejects anything outside `ALLOWED_IMAGE_MIME_TYPES`
 * before a signed URL is ever issued — the real, authoritative check on the
 * actual bytes happens at `/api/media/uploads` (confirm), since nothing this
 * route receives can be trusted yet.
 *
 * No admin UI calls this in P04 (that's P07) — it exists because "Client →
 * request signed upload → … → server confirmation" is the phase's own
 * described flow, and a later phase's UI needs a real endpoint to call
 * rather than inventing this later too.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const signedUpload = await requestUpload(body);
    return NextResponse.json(signedUpload, { status: 201 });
  } catch (error) {
    const appError = toAppError(error);
    return NextResponse.json(
      { code: appError.code, message: appError.messageFor('ar') },
      { status: appError.httpStatus },
    );
  }
}

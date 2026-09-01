import { NextResponse } from 'next/server';

import { toAppError } from '@/modules/core';
import { confirmUpload } from '@/modules/media';

/**
 * "… → direct upload → server confirmation → MediaAsset persistence" (P04).
 * Re-reads whatever actually landed at `key` from the storage provider and
 * decodes it — the client's `confirmUpload` call carries no content-type or
 * size, because none of that is trusted here; the only trusted input is the
 * key, and the provider's own view of what's stored at it.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const asset = await confirmUpload(
      { key: body?.key },
      { altAr: body?.altAr, altEn: body?.altEn },
    );
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    const appError = toAppError(error);
    return NextResponse.json(
      { code: appError.code, message: appError.messageFor('ar') },
      { status: appError.httpStatus },
    );
  }
}

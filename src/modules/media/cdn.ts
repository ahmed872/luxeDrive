import { getStorageProvider } from './provider-factory';

/**
 * The one function anything outside `media` calls to get a displayable URL
 * for a `MediaAsset` — `catalog`, `content`, and every future consumer.
 * Nobody else constructs a provider URL, a CDN domain, or an S3 path by
 * hand, which is what makes changing `MEDIA_PUBLIC_BASE_URL` (or the
 * provider entirely) a one-file change instead of a grep-and-replace.
 */
export function getMediaPublicUrl(storageKey: string): string {
  return getStorageProvider().getPublicUrl(storageKey);
}

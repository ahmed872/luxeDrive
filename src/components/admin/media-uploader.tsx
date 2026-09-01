'use client';

import { useId, useRef, useState } from 'react';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export interface UploadedMediaAsset {
  id: string;
  src: string;
  altAr: string | null;
  altEn: string | null;
  width: number | null;
  height: number | null;
}

export type MediaUploadContext = 'product' | 'category' | 'brand';

export interface MediaUploaderProps {
  context: MediaUploadContext;
  onUploaded: (asset: UploadedMediaAsset) => void;
  labels: { chooseFile: string; uploading: string; error: string };
  multiple?: boolean;
  className?: string;
}

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

/**
 * The one client-side path from "a person picks a file" to "a MediaAsset
 * exists and the caller has its id and a displayable URL" — the exact
 * three-step flow P04 built the API for (`request` → direct `PUT` →
 * `confirm`), now with a real caller. Every admin screen that needs an
 * image (brand logo, category image, product gallery) uses this one
 * component rather than re-implementing the upload sequence.
 */
export function MediaUploader({
  context,
  onUploaded,
  labels,
  multiple = false,
  className,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  async function uploadOne(file: File): Promise<void> {
    const requestRes = await fetch('/api/media/upload-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, contentType: file.type, sizeBytes: file.size }),
    });
    if (!requestRes.ok) throw new Error('upload-request-failed');
    const signed: { url: string; headers: Record<string, string>; key: string } =
      await requestRes.json();

    const putRes = await fetch(signed.url, { method: 'PUT', headers: signed.headers, body: file });
    if (!putRes.ok) throw new Error('put-failed');

    const confirmRes = await fetch('/api/media/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: signed.key }),
    });
    if (!confirmRes.ok) throw new Error('confirm-failed');
    const asset: UploadedMediaAsset = await confirmRes.json();
    onUploaded(asset);
  }

  async function handleFiles(files: FileList) {
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Sequential, not Promise.all: predictable ordering (matters for the
        // product gallery's initial `position`) and a single clear failure
        // point rather than a partial-parallel-failure to untangle.
        await uploadOne(file);
      }
    } catch {
      toast({ title: labels.error, variant: 'error' });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className={cn('inline-flex', className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          const files = event.target.files;
          if (files && files.length > 0) void handleFiles(files);
        }}
      />
      <Button
        type="button"
        variant="outline"
        loading={isUploading}
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? null : <Upload className="size-4" aria-hidden="true" />}
        {isUploading ? labels.uploading : labels.chooseFile}
      </Button>
    </div>
  );
}

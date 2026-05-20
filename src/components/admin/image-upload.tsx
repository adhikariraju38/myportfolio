"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUpload } from "@/hooks/use-upload";

export interface ImageRef {
  url?: string;
  mediaId?: string;
}

interface ImageUploadProps {
  value: ImageRef | null | undefined;
  onChange: (v: ImageRef | null) => void;
  label?: string;
  accept?: string;
}

export function ImageUpload({ value, onChange, label = "Image", accept = "image/*" }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useUpload();
  const [previewKey, setPreviewKey] = useState(0);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await upload(file);
      onChange({ url: res.url, mediaId: res.id });
      setPreviewKey((k) => k + 1);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div>
      <p className="mb-1 block text-xs font-medium text-text-secondary">{label}</p>
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-bg-tertiary">
          {value?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={previewKey} src={value.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-text-tertiary">
              No image
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={onFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="rounded-md border border-border bg-bg-secondary px-3 py-1.5 text-xs text-text-secondary hover:text-text disabled:opacity-60"
        >
          {isUploading ? "Uploading…" : value?.url ? "Replace" : "Upload"}
        </button>
        {value?.url && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-md px-3 py-1.5 text-xs text-text-tertiary hover:text-red-400"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

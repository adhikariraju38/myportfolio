"use client";

import { useState } from "react";
import { apiClient, ApiClientError } from "@/lib/api-client";

export interface UploadResult {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  filename: string;
}

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<UploadResult> {
    setIsUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const data = await apiClient.post<UploadResult>("/api/admin/upload", form);
      return data;
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }

  return { upload, isUploading, error };
}

// app/admin/upload/page.tsx
"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { uploadArtwork, UploadState } from "../actions/image-upload";

// Customize your available artwork tags here
// const AVAILABLE_TAGS = [
//   "featured",
//   "digital-art",
//   "illustration",
//   "3d-render",
//   "concept-art",
//   "character-design",
//   "sketch",
// ];

const initialState: UploadState = {};

export default function ImageUploader({ AVAILABLE_TAGS }: { AVAILABLE_TAGS: string[] }) {
  const [state, formAction, isPending] = useActionState(uploadArtwork, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      clearImage()
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return clearImage;
  })

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 my-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Upload Portfolio Artwork
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Destination folder: <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono">blog_page_artworks</code>
        </p>
      </div>

      <form
        ref={formRef}
        action={async (formData) => {
          await formAction(formData);
          setPreviewUrl(null);
          formRef.current?.reset();
        }}
        className="space-y-6"
      >
        {/* 1. Image Display Name */}
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Image Display Name
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            required
            placeholder="e.g., Cyberpunk Alleyway Study"
            className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 2. Image File Input & Preview */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Artwork Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-zinc-200 cursor-pointer"
          />

          {previewUrl && (
            <div className="mt-4 relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-2">
              <img
                src={previewUrl}
                alt="Selected preview"
                className="max-h-56 mx-auto object-contain rounded"
              />
            </div>
          )}
        </div>

        {/* 3. Tag Checkboxes */}
        <div>
          <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Select Tags
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {AVAILABLE_TAGS.map((tag) => (
              <label
                key={tag}
                className="flex items-center space-x-2.5 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  className="w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {tag}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition cursor-pointer"
        >
          {isPending ? "Uploading to Cloudinary..." : "Upload Artwork"}
        </button>

        {/* Feedback Messages */}
        {state?.error && (
          <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm space-y-2">
            <p className="font-semibold">Artwork uploaded successfully!</p>
            <p className="text-xs break-all">
              <strong>Public ID:</strong> {state.publicId}
            </p>
            {state.imageUrl && (
              <a
                href={state.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs underline font-medium"
              >
                View uploaded image ↗
              </a>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
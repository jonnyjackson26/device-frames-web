"use client";

import { useCallback } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  className?: string;
  frameMode?: boolean;
}

export function FileUpload({ onFileSelect, selectedFile, className, frameMode }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const baseClasses = frameMode
    ? "relative flex flex-col items-center justify-center w-full h-full border-2 border-blue-200 dark:border-blue-500/60 rounded-lg bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm"
    : "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors";

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`${baseClasses} cursor-pointer ${className ?? ""}`}
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <svg
          className="w-12 h-12 mb-4 text-zinc-400 dark:text-zinc-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-300">
          {selectedFile ? (
            <span className="font-semibold">{selectedFile.name}</span>
          ) : (
            <>
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </>
          )}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          PNG, JPEG, or WebP
        </p>
      </label>
    </div>
  );
}

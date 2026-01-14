"use client";

import { useState, useEffect, useCallback, useId } from "react";
import type { ChangeEvent, DragEvent } from "react";

interface PhoneProps {
  frameImageUrl: string | null;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  className?: string;
}

export function Phone({ frameImageUrl, onFileSelect, selectedFile, className }: PhoneProps) {
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>("/placeholder_frame.png");
  const inputId = useId();

  // Initialize with placeholder, swap when frameImageUrl changes
  useEffect(() => {
    if (frameImageUrl) {
      setDisplayImageUrl(frameImageUrl);
    } else {
      setDisplayImageUrl("/placeholder_frame.png");
    }
  }, [frameImageUrl]);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className={`relative flex items-center justify-center w-full h-full bg-transparent ${className ?? ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {displayImageUrl && (
        <img
          src={displayImageUrl}
          alt="Device frame"
          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
        />
      )}
      
      {/* Drag/Drop overlay hint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12 text-zinc-400 dark:text-zinc-600 opacity-60"
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
          <p className="text-sm text-zinc-400 dark:text-zinc-600 text-center font-medium">
            Drag and drop or browse files
          </p>
        </div>
      </div>
      
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        id={inputId}
      />
    </div>
  );
}

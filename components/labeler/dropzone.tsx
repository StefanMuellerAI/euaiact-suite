"use client";

import { useCallback, useRef, useState } from "react";
import { ACCEPT_ATTRIBUTE, MAX_FILE_BYTES } from "@/lib/image-io";

export function Dropzone({
  onFile,
  compact = false,
}: {
  onFile: (file: File) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  if (compact) {
    return (
      <>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 transition-colors hover:bg-ink-50"
        >
          Anderes Bild wählen
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </>
    );
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={`rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        isDragging ? "border-eu-blue bg-eu-blue/5" : "border-ink-300 bg-white"
      }`}
    >
      <p className="text-base font-semibold text-ink-900">
        Bild hierher ziehen
      </p>
      <p className="mt-1 text-sm text-ink-500">
        oder eine Datei vom Rechner auswählen
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-5 inline-flex items-center rounded-lg bg-eu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-eu-blue-dark"
      >
        Bild auswählen
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <p className="mt-5 text-xs text-ink-400">
        PNG, JPEG, WebP, GIF, AVIF oder BMP · bis{" "}
        {Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB
      </p>
      <p className="mt-1 text-xs text-ink-400">
        Die Datei bleibt auf diesem Gerät – sie wird nicht hochgeladen.
      </p>
    </div>
  );
}

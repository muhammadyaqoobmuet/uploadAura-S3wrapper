"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import { uploadFiles } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-tar",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "audio/wav",
  "audio/webm",
  "video/mp4",
  "video/webm",
]);

const MAX_FILES = 10;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

interface UploadZoneProps {
  onSuccess: () => void;
}

export function UploadZone({ onSuccess }: UploadZoneProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateAndUpload = useCallback(
    async (raw: FileList | File[]) => {
      const files = Array.from(raw);
      if (files.length === 0) return;

      // Count check
      if (files.length > MAX_FILES) {
        toast.error(
          "Too many files",
          `You can upload at most ${MAX_FILES} files at once.`,
        );
        return;
      }

      // MIME type check
      const badType = files.filter((f) => !ALLOWED_MIME_TYPES.has(f.type));
      if (badType.length > 0) {
        toast.error(
          "Unsupported file type",
          `${badType.map((f) => f.name).join(", ")} cannot be uploaded.`,
        );
        return;
      }

      // Size check
      const tooBig = files.filter((f) => f.size > MAX_FILE_SIZE);
      if (tooBig.length > 0) {
        toast.error(
          "File too large",
          `${tooBig.map((f) => f.name).join(", ")} exceeds 100 MB.`,
        );
        return;
      }

      setUploading(true);
      try {
        const res = await uploadFiles(files);
        const { failedCount } = res.results;
        const allOk =
          failedCount.toLowerCase().includes("no failed count") ||
          failedCount.toLowerCase().includes("all uploaded");

        if (allOk) {
          toast.success(
            `${files.length} file${files.length !== 1 ? "s" : ""} uploaded`,
            "Your files are ready.",
          );
        } else {
          toast.warning("Partial upload", failedCount);
        }

        onSuccess();
      } catch (err: unknown) {
        toast.error(
          "Upload failed",
          err instanceof Error ? err.message : "Something went wrong.",
        );
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [toast, onSuccess],
  );

  // ── Drag handlers ──────────────────────────────────────────

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (dragCounter.current === 1) setDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    if (!uploading && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files);
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Upload files — drag here or click to browse"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !uploading) {
          inputRef.current?.click();
        }
      }}
      animate={{
        borderColor: dragging
          ? "var(--color-accent)"
          : "var(--color-border-2)",
        backgroundColor: dragging
          ? "var(--color-accent-light)"
          : "var(--color-white)",
        boxShadow: dragging
          ? "0 0 0 4px rgba(184, 115, 51, 0.12)"
          : "none",
      }}
      transition={{ duration: 0.15 }}
      className="relative flex min-h-[140px] cursor-pointer select-none flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-8 text-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      style={{
        // Initial static values — Framer Motion will animate from these
        borderColor: "var(--color-border-2)",
        backgroundColor: "var(--color-white)",
      }}
    >
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={Array.from(ALLOWED_MIME_TYPES).join(",")}
        onChange={onInputChange}
        aria-label="Select files to upload"
        className="sr-only"
        tabIndex={-1}
      />

      <AnimatePresence mode="wait" initial={false}>
        {uploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.16 }}
            className="flex flex-col items-center gap-2.5"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
            <p className="text-[13px] font-medium text-[var(--color-ink-muted)]">
              Uploading…
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.16 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Icon */}
            <motion.div
              animate={
                dragging
                  ? { scale: 1.12, rotate: -3 }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-2)]"
            >
              <Upload
                size={20}
                aria-hidden="true"
                className={
                  dragging
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-ink-muted)]"
                }
              />
            </motion.div>

            {/* Copy */}
            <div>
              <p className="text-[13.5px] font-medium text-[var(--color-ink)]">
                {dragging
                  ? "Drop to upload"
                  : "Drag files here or click to browse"}
              </p>
              <p className="mt-0.5 text-[12px] text-[var(--color-ink-faint)]">
                Up to {MAX_FILES} files · 100 MB each · images, docs, video &
                more
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

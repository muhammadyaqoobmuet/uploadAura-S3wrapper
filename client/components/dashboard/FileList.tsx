"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Download,
  File,
  FileSpreadsheet,
  FileText,
  Music,
  Presentation,
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import {
  deleteFiles,
  downloadFiles,
  FileItem,
  getFiles,
  Pagination,
} from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cn, formatDate, getFileIcon } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";
import { confirmation001Sound } from "@/lib/confirmation-001";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

// Prefer the explicit backend origin env var; fall back to stripping /api
// from the API URL so a single env var still works.
// Strip any trailing slash so `${SERVER_ORIGIN}/files/...` never becomes
// a double slash (e.g. "...dev//files/..."), which 404s.
const SERVER_ORIGIN = (
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(
    /\/api\/?$/,
    "",
  )
).replace(/\/+$/, "");

/** Stable public URL for viewing/embedding a file — no auth, no expiry. */
function fileViewUrl(id: string) {
  return `${SERVER_ORIGIN}/files/${id}/view`;
}

// ─── File icon / thumbnail ────────────────────────────────────────────────────

function FileIconCell({
  file,
}: {
  file: Pick<FileItem, "_id" | "ext" | "mimeType" | "url" | "originalName">;
}) {
  const type = getFileIcon(file.ext, file.mimeType);

  const iconNode: Record<string, React.ReactNode> = {
    video: <Video size={15} aria-hidden="true" />,
    audio: <Music size={15} aria-hidden="true" />,
    pdf: (
      <FileText
        size={15}
        aria-hidden="true"
        className="text-[var(--color-error)]"
      />
    ),
    word: <FileText size={15} aria-hidden="true" className="text-blue-500" />,
    spreadsheet: (
      <FileSpreadsheet
        size={15}
        aria-hidden="true"
        className="text-green-600"
      />
    ),
    presentation: (
      <Presentation size={15} aria-hidden="true" className="text-orange-500" />
    ),
    archive: <Archive size={15} aria-hidden="true" />,
    csv: <FileSpreadsheet size={15} aria-hidden="true" />,
    text: <FileText size={15} aria-hidden="true" />,
    file: <File size={15} aria-hidden="true" />,
  };

  if (type === "image") {
    const viewUrl = fileViewUrl(file._id);
    return (
      // External origin — use <a>, not Next.js <Link> which is for same-origin routing
      <a
        href={viewUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${file.originalName} in new tab`}
        className="block"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-8 w-8 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <Image
            src={viewUrl}
            fill
            sizes="32px"
            alt={file.originalName}
            className="object-cover"
            unoptimized
            onError={(e) => {
              // Fall back to pre-signed S3 URL if the view endpoint fails
              const img = e.currentTarget as HTMLImageElement;
              if (img.src !== file.url) {
                img.src = file.url;
              } else {
                img.style.display = "none";
              }
            }}
          />
        </div>
      </a>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]">
      {iconNode[type] ?? <File size={15} aria-hidden="true" />}
    </div>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRow({ index }: { index: number }) {
  const widths = [
    "24px",
    "32px",
    "55%",
    "48px",
    "36px",
    "36px",
    "72px",
    "48px",
  ];
  return (
    <tr className="border-b border-[var(--color-border)]" aria-hidden="true">
      {widths.map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-3.5 animate-pulse rounded bg-[var(--color-surface-3)]"
            style={{
              width: w,
              animationDelay: `${index * 60 + i * 20}ms`,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <tr>
      <td colSpan={8}>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.1,
            }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-2)]"
          >
            {!filtered && (
              <>
                {/* Animated upload arrow */}
                <motion.div
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Upload
                    size={24}
                    className="text-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                </motion.div>

                {/* Pulsing ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)]"
                  aria-hidden="true"
                />
              </>
            )}

            {filtered && (
              <File
                size={24}
                className="text-[var(--color-ink-faint)]"
                aria-hidden="true"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="text-[14px] font-medium text-[var(--color-ink)]">
              {filtered
                ? "No files match your search"
                : "Your canvas awaits ✨"}
            </p>
            <p className="mt-0.5 text-[12px] text-[var(--color-ink-faint)]">
              {filtered
                ? "Try a different keyword."
                : "Upload your first file to get started. It takes seconds."}
            </p>
          </motion.div>
        </div>
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface FileListProps {
  /** Increment this to trigger a refresh */
  refreshTrigger?: number;
}

export function FileList({ refreshTrigger = 0 }: FileListProps) {
  const toast = useToast();
  const playDeleteSound = useSound(confirmation001Sound, 0.65);

  // ── Data state ──────────────────────────────────────────────
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // ── UI state ────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Search debounce ─────────────────────────────────────────
  // setLoading(true) is called inside the setTimeout callback (not inside
  // an effect body), so it does not trigger the cascading-render warning.
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      setDebouncedKeyword(val);
      setPage(1);
    }, 300);
  };

  // ── Fetch (manual trigger for post-delete refresh) ──────────
  // This is called only from event handlers (delete, page change),
  // never directly from an effect body.
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFiles({
        keyword: debouncedKeyword || undefined,
        pageNumber: page,
        pageSize: PAGE_SIZE,
      });
      setFiles(res.files);
      setPagination(res.pagination);
      setSelected(new Set());
    } catch (err: unknown) {
      toast.error(
        "Failed to load files",
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, page, toast]);

  // ── Effect: inline fetch, never calls setLoading(true) ──────
  // Initial state is loading=true so the skeleton shows on first render.
  // For page/keyword changes, setLoading(true) is called in the event
  // handler BEFORE the state update, so it is never synchronous inside
  // this effect body.
  useEffect(() => {
    let cancelled = false;

    getFiles({
      keyword: debouncedKeyword || undefined,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    })
      .then((res) => {
        if (cancelled) return;
        setFiles(res.files);
        setPagination(res.pagination);
        setSelected(new Set());
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        toast.error(
          "Failed to load files",
          err instanceof Error ? err.message : undefined,
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedKeyword, refreshTrigger]);

  // ── Selection helpers ───────────────────────────────────────
  const allSelected =
    files.length > 0 && files.every((f) => selected.has(f._id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(files.map((f) => f._id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Download ────────────────────────────────────────────────
  const handleDownload = async (ids: string[]) => {
    if (ids.length === 0) return;
    setDownloading(true);
    try {
      const res = await downloadFiles(ids);
      const a = document.createElement("a");
      a.href = res.downloadUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: unknown) {
      toast.error(
        "Download failed",
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setDownloading(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget || deleteTarget.length === 0) return;
    setDeleting(true);
    try {
      const res = await deleteFiles(deleteTarget);
      playDeleteSound();
      toast.success(
        `${res.deletedCount} file${res.deletedCount !== 1 ? "s" : ""} deleted`,
        res.failedCount > 0
          ? `${res.failedCount} could not be deleted.`
          : undefined,
      );
      setDeleteTarget(null);
      // If we deleted the only file on the last page, go back one page
      if (files.length === deleteTarget.length && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchFiles();
      }
    } catch (err: unknown) {
      toast.error(
        "Delete failed",
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = pagination?.totalPages ?? 1;
  const totalCount = pagination?.totalCount ?? 0;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="relative">
        <Search
          size={14}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]"
        />
        <input
          type="search"
          placeholder="Search files…"
          value={keyword}
          onChange={onSearchChange}
          aria-label="Search files"
          className="input-base !pl-8 !text-[13px]"
        />
      </div>

      {/* ── Bulk actions bar ──────────────────────────────────── */}
      <AnimatePresence>
        {someSelected && (
          <motion.div
            key="bulk-bar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] px-3 py-2 shadow-[var(--shadow-sm)]"
            aria-live="polite"
          >
            <span className="mr-auto text-[13px] text-[var(--color-ink-muted)]">
              <strong className="font-semibold text-[var(--color-ink)]">
                {selected.size}
              </strong>{" "}
              {selected.size === 1 ? "file" : "files"} selected
            </span>
            <Button
              variant="secondary"
              size="sm"
              loading={downloading}
              leftIcon={<Download size={13} aria-hidden="true" />}
              onClick={() => handleDownload(Array.from(selected))}
            >
              Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              leftIcon={<Trash2 size={13} aria-hidden="true" />}
              onClick={() => setDeleteTarget(Array.from(selected))}
            >
              Delete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table ─────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]" aria-label="Files">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                <th scope="col" className="w-10 px-4 py-2.5 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = someSelected && !allSelected;
                      }
                    }}
                    onChange={toggleAll}
                    aria-label={allSelected ? "Deselect all" : "Select all"}
                    className="h-3.5 w-3.5 cursor-pointer accent-[var(--color-accent)]"
                  />
                </th>
                <th
                  scope="col"
                  className="w-10 px-2 py-2.5"
                  aria-label="File type"
                />
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left font-medium text-[var(--color-ink-muted)]"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left font-medium text-[var(--color-ink-muted)]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left font-medium text-[var(--color-ink-muted)]"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left font-medium text-[var(--color-ink-muted)]"
                >
                  Via
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left font-medium text-[var(--color-ink-muted)]"
                >
                  Uploaded
                </th>
                <th
                  scope="col"
                  className="w-20 px-4 py-2.5"
                  aria-label="Actions"
                />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <SkeletonRow key={i} index={i} />
                ))
              ) : files.length === 0 ? (
                <EmptyState filtered={!!debouncedKeyword} />
              ) : (
                files.map((file, i) => {
                  const isSelected = selected.has(file._id);
                  return (
                    <motion.tr
                      key={file._id}
                      initial={{ opacity: 0, x: -20, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.97 }}
                      transition={{
                        delay: i * 0.04,
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={cn(
                        "group border-b border-[var(--color-border)] transition-colors duration-75",
                        isSelected
                          ? "bg-[var(--color-accent-light)]"
                          : "hover:bg-[var(--color-surface-2)]",
                      )}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(file._id)}
                          aria-label={`Select ${file.originalName}`}
                          className="h-3.5 w-3.5 cursor-pointer accent-[var(--color-accent)]"
                        />
                      </td>

                      {/* File icon / thumbnail */}
                      <td className="px-2 py-3">
                        <FileIconCell file={file} />
                      </td>

                      {/* Name */}
                      <td className="max-w-[200px] px-4 py-3 lg:max-w-[280px]">
                        <p
                          className="truncate font-medium text-[var(--color-ink)]"
                          title={file.originalName}
                        >
                          {file.originalName}
                        </p>
                      </td>

                      {/* Size */}
                      <td
                        className="whitespace-nowrap px-4 py-3 text-[var(--color-ink-muted)]"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {file.formattedSize}
                      </td>

                      {/* Extension badge */}
                      <td className="px-4 py-3">
                        <Badge variant="default">.{file.ext}</Badge>
                      </td>

                      {/* Upload via badge */}
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            file.uploadVia === "API" ? "accent" : "default"
                          }
                        >
                          {file.uploadVia}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td
                        className="whitespace-nowrap px-4 py-3 text-[var(--color-ink-muted)]"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {formatDate(file.createdAt)}
                      </td>

                      {/* Per-row actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            aria-label={`Download ${file.originalName}`}
                            title="Download"
                            onClick={() => handleDownload([file._id])}
                            className="btn-ghost !p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                          >
                            <Download size={13} aria-hidden="true" />
                          </button>
                          <button
                            aria-label={`Delete ${file.originalName}`}
                            title="Delete"
                            onClick={() => setDeleteTarget([file._id])}
                            className="btn-ghost !p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-error-light)] hover:text-[var(--color-error)]"
                          >
                            <Trash2 size={13} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────── */}
        {!loading && totalCount > 0 && (
          <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3">
            <p
              className="text-[12px] text-[var(--color-ink-faint)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {totalCount.toLocaleString()} file{totalCount !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <span
                className="text-[12px] text-[var(--color-ink-muted)]"
                style={{ fontVariantNumeric: "tabular-nums" }}
                aria-live="polite"
                aria-label={`Page ${page} of ${totalPages}`}
              >
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => {
                  setLoading(true);
                  setPage((p) => Math.max(1, p - 1));
                }}
                disabled={page <= 1}
                aria-label="Previous page"
                className="btn-ghost !p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} aria-hidden="true" />
              </button>
              <button
                onClick={() => {
                  setLoading(true);
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="btn-ghost !p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirm modal ───────────────────────────────── */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete files"
        description={
          deleteTarget?.length === 1
            ? "Are you sure you want to delete this file? This cannot be undone."
            : `Are you sure you want to delete ${deleteTarget?.length} files? This cannot be undone.`
        }
        size="sm"
        disableBackdropClose={deleting}
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={deleting}
            leftIcon={<Trash2 size={14} aria-hidden="true" />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

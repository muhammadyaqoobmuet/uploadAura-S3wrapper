import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a human-readable format.
 * e.g. "Jun 30, 2026"
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Returns storage usage as a 0–100 percentage, clamped.
 */
export function storagePercent(usedBytes: number, quotaBytes: number): number {
  if (!quotaBytes || quotaBytes <= 0) return 0;
  return Math.min(100, Math.round((usedBytes / quotaBytes) * 100));
}

/**
 * Formats a Date as a YYYY-MM-DD string (local time).
 */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Returns a new Date that is `days` days before the given date.
 */
export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

/**
 * Returns a semantic file type key based on extension and mime type.
 * Used to pick the right icon in FileList.
 */
export function getFileIcon(ext: string, mimeType: string): string {
  const e = (ext || "").toLowerCase().replace(/^\./, "");
  const m = (mimeType || "").toLowerCase();

  if (m.startsWith("image/")) return "image";
  if (m.startsWith("video/")) return "video";
  if (m.startsWith("audio/")) return "audio";
  if (e === "pdf" || m === "application/pdf") return "pdf";
  if (["doc", "docx"].includes(e) || m.includes("word")) return "word";
  if (
    ["xls", "xlsx"].includes(e) ||
    m.includes("spreadsheet") ||
    m.includes("excel")
  )
    return "spreadsheet";
  if (
    ["ppt", "pptx"].includes(e) ||
    m.includes("presentation") ||
    m.includes("powerpoint")
  )
    return "presentation";
  if (
    ["zip", "rar", "7z", "tar", "gz", "bz2"].includes(e) ||
    m.includes("zip") ||
    m.includes("archive") ||
    m.includes("compressed")
  )
    return "archive";
  if (e === "csv" || m === "text/csv") return "csv";
  if (["txt", "md", "log", "rtf"].includes(e) || m.startsWith("text/"))
    return "text";
  return "file";
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function getFileIcon(ext: string, mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "pdf";
  if (ext === "doc" || ext === "docx" || mimeType.includes("word"))
    return "word";
  if (
    ext === "xls" ||
    ext === "xlsx" ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel")
  )
    return "spreadsheet";
  if (ext === "pptx" || mimeType.includes("presentation"))
    return "presentation";
  if (
    ext === "zip" ||
    ext === "tar" ||
    mimeType.includes("zip") ||
    mimeType.includes("tar")
  )
    return "archive";
  if (ext === "csv" || mimeType === "text/csv") return "csv";
  if (ext === "txt" || mimeType === "text/plain") return "text";
  return "file";
}

export function storagePercent(used: number, quota: number): number {
  if (quota === 0) return 0;
  return Math.min(100, Math.round((used / quota) * 100));
}

// Date helpers for analytics
export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function subtractDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() - days);
  return result;
}

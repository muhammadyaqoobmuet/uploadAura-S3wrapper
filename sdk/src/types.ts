import type { Readable } from "node:stream";

// ─── Config ───────────────────────────────────────────────────────────────────

export interface UploadAuraConfig {
  /**
   * Your API key from the UploadAura dashboard.
   * Format: `sk_live_<48-char hex>`
   */
  apiKey: string;
}

// ─── File sources ─────────────────────────────────────────────────────────────

/** Absolute or relative path to a file on disk. */
export type PathSource = string;

/** Upload an in-memory buffer. */
export interface BufferSource {
  /** Raw file bytes. */
  buffer: Buffer;
  /** File name with extension, e.g. `"photo.jpg"`. */
  name: string;
  /** MIME type. Defaults to `"application/octet-stream"`. */
  type?: string;
}

/** Upload from a Node.js Readable stream. */
export interface StreamSource {
  /** Node.js Readable stream. */
  stream: Readable;
  /** File name with extension, e.g. `"report.csv"`. */
  name: string;
  /** MIME type. Defaults to `"application/octet-stream"`. */
  type?: string;
}

/**
 * Anything you can pass to `upload()`.
 *
 * ```ts
 * // Path
 * await aura.upload("./photo.jpg");
 *
 * // Buffer
 * await aura.upload({ buffer: buf, name: "photo.jpg", type: "image/jpeg" });
 *
 * // Stream
 * await aura.upload({ stream: fs.createReadStream("./data.csv"), name: "data.csv" });
 *
 * // Mix
 * await aura.upload(["./a.pdf", { buffer: buf, name: "b.jpg" }]);
 * ```
 */
export type FileSource = PathSource | BufferSource | StreamSource;

// ─── Results ──────────────────────────────────────────────────────────────────

export interface UploadedFile {
  fileId: string;
  originalName: string;
  size: number;
  ext: string;
  mimeType: string;
}

export interface UploadResult {
  /** Successfully uploaded files. */
  files: UploadedFile[];
  /** Number of files that failed to upload on the server side. Re-upload them. */
  failed: number;
  /** Human-readable summary from the server. */
  message: string;
}

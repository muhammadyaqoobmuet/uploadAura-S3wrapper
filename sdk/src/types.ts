import type { Readable } from "node:stream";

// ─── Config ───────────────────────────────────────────────────────────────────

export interface UploadAuraConfig {
  /**
   * Your API key from the UploadAura dashboard.
   * Format: `sk_live_<48-char hex>`
   */
  apiKey: string;
  /**
   * Override the API base URL (no trailing slash). Optional — only `apiKey`
   * is required. Resolved in this order:
   *   1. `baseUrl` here,
   *   2. the `UPLOADAURA_BASE_URL` environment variable,
   *   3. the hosted default `https://uploadaurabackend.yaqoobhalepoto.dev`.
   * Point this at a locally-running backend (e.g. `http://localhost:8000`)
   * when testing.
   */
  baseUrl?: string;
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
  /** Stable UploadAura file id. */
  fileId: string;
  /** Original file name as uploaded. */
  originalName: string;
  /** Size in bytes. */
  size: number;
  /** Lowercased extension without the dot, e.g. `"jpg"`. */
  ext: string;
  /** MIME type, e.g. `"image/jpeg"`. */
  mimeType: string;
  /**
   * Public, browser-viewable URL for the file (served via the
   * `/files/:fileId/view` stream endpoint). Safe to use directly in an
   * `<img src>` / `<video>` / `<a>` on the frontend.
   */
  url: string;
}

export interface UploadResult {
  /** Successfully uploaded files. */
  files: UploadedFile[];
  /** Number of files that failed to upload on the server side. Re-upload them. */
  failed: number;
  /** Human-readable summary from the server. */
  message: string;
}

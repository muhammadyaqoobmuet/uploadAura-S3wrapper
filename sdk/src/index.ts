import fs from "node:fs";
import path from "node:path";
import FormData from "form-data";
import { UploadAuraError } from "./errors.js";
import type {
  BufferSource,
  FileSource,
  StreamSource,
  UploadAuraConfig,
  UploadedFile,
  UploadResult,
} from "./types.js";

// ─── Public re-exports ────────────────────────────────────────────────────────

export { UploadAuraError } from "./errors.js";
export type {
  BufferSource,
  FileSource,
  PathSource,
  StreamSource,
  UploadAuraConfig,
  UploadedFile,
  UploadResult,
} from "./types.js";

// ─── Internal helpers ─────────────────────────────────────────────────────────

const MAX_FILES = 10;
const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

function isBufferSource(src: FileSource): src is BufferSource {
  return typeof src === "object" && "buffer" in src;
}

function isStreamSource(src: FileSource): src is StreamSource {
  return typeof src === "object" && "stream" in src;
}

type ResolvedSource = { buffer: Buffer; name: string; type?: string };

/**
 * Minimal extension → MIME map. The backend's multer rejects any part whose
 * Content-Type is not an allowed type, so path uploads must infer a MIME type
 * from the file extension (streams/buffers rely on the caller's `type`).
 */
const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
  gif: "image/gif",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
  csv: "text/csv",
  zip: "application/zip",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  mp4: "video/mp4",
  webm: "video/webm",
  wav: "audio/wav",
  tar: "application/x-tar",
};

function mimeFromName(name: string): string | undefined {
  const ext = path.extname(name).toLowerCase().replace(/^\./, "");
  return MIME_BY_EXT[ext];
}

/**
 * Resolve any FileSource to an in-memory Buffer.
 *
 * The backend uses `multer.memoryStorage`, so it buffers the upload server-side
 * regardless — streaming the request body from the client would not save memory and,
 * with `form-data` + Node's `fetch`, is unreliable (the multipart trailer does
 * not flush, producing "Unexpected end of form" on the server). Resolving to a
 * Buffer and sending `form.getBuffer()` is correct and robust.
 */
async function resolveSource(src: FileSource): Promise<ResolvedSource> {
  if (isBufferSource(src)) {
    return { buffer: src.buffer, name: src.name, type: src.type };
  }
  if (isStreamSource(src)) {
    const chunks: Buffer[] = [];
    for await (const chunk of src.stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return { buffer: Buffer.concat(chunks), name: src.name, type: src.type };
  }
  // Path source — infer MIME from the extension.
  const abs = path.resolve(src);
  const buffer = await fs.promises.readFile(abs);
  return { buffer, name: path.basename(abs), type: mimeFromName(abs) };
}

/**
 * The backend returns `failedCount` as a human-readable string:
 *  - `"no failed count all uploaded successfully !"`  → 0
 *  - `"no of failed files 2 please consider …"`      → 2
 */
function parseFailedCount(raw: string): number {
  if (/all uploaded/i.test(raw)) return 0;
  const m = /(\d+)/.exec(raw);
  return m ? parseInt(m[1] ?? "0", 10) : 0;
}

// ─── Client ───────────────────────────────────────────────────────────────────

/**
 * UploadAura SDK client.
 *
 * @example
 * ```ts
 * import { UploadAura } from "uploadaura-sdk";
 *
 * const aura = new UploadAura({
 *   apiKey:  "sk_live_...",
 *
 * });
 *
 * const { files, failed } = await aura.upload("./photo.jpg");
 * console.log(files[0].fileId);
 * ```
 */
export class UploadAura {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: UploadAuraConfig) {
    if (!config.apiKey) {
      throw new Error("UploadAura: apiKey is required");
    }
    if (!config.apiKey.startsWith("sk_")) {
      throw new Error('UploadAura: apiKey must start with "sk_"');
    }

    this.apiKey = config.apiKey;
    // Strip any trailing slash so concatenating "/api/v1/upload" never
    // produces a double slash (e.g. "...dev//api/..."), which the
    // server rejects with a 404 HTML page.
    this.baseUrl = (
      config.baseUrl ?? "https://uploadaurabackend.yaqoobhalepoto.dev"
    ).replace(/\/+$/, "");
  }

  /**
   * Upload one or more files to UploadAura storage.
   *
   * Accepts file **paths**, in-memory **Buffers**, Node.js **Readable streams**,
   * or any mix of them. Pass a single source or an array of up to 10 sources.
   *
   * @example
   * ```ts
   * // Single path
   * await aura.upload("./report.pdf");
   *
   * // Multiple paths
   * await aura.upload(["./a.jpg", "./b.png"]);
   *
   * // Buffer
   * const buf = fs.readFileSync("./photo.jpg");
   * await aura.upload({ buffer: buf, name: "photo.jpg", type: "image/jpeg" });
   *
   * // Stream
   * const stream = fs.createReadStream("./data.csv");
   * await aura.upload({ stream, name: "data.csv", type: "text/csv" });
   *
   * // Mixed
   * await aura.upload([
   *   "./cover.jpg",
   *   { buffer: pdfBytes, name: "doc.pdf", type: "application/pdf" },
   * ]);
   * ```
   *
   * @throws {UploadAuraError} When the server rejects the request.
   * @throws {Error} When a local constraint is violated (too many files, file too large, etc.).
   */
  async upload(files: FileSource | FileSource[]): Promise<UploadResult> {
    const sources = Array.isArray(files) ? files : [files];

    if (sources.length === 0) {
      throw new Error("UploadAura: at least one file source is required");
    }
    if (sources.length > MAX_FILES) {
      throw new Error(
        `UploadAura: max ${MAX_FILES} files per request (received ${sources.length})`,
      );
    }

    const resolved = await Promise.all(sources.map(resolveSource));

    const form = new FormData();

    for (const r of resolved) {
      if (r.buffer.length > MAX_BYTES) {
        throw new Error(
          `UploadAura: "${r.name}" is ${(r.buffer.length / 1024 / 1024).toFixed(1)} MB — exceeds the 100 MB limit`,
        );
      }
      form.append("files", r.buffer, {
        filename: r.name,
        contentType: r.type ?? "application/octet-stream",
        knownLength: r.buffer.length,
      });
    }

    const body = form.getBuffer();

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/api/v1/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          // form-data sets the correct Content-Type (with boundary) + Content-Length
          ...form.getHeaders(),
        },
        body,
      });
    } catch (cause) {
      throw new UploadAuraError(
        `UploadAura: network error — ${cause instanceof Error ? cause.message : String(cause)}`,
        0,
        "NETWORK_ERROR",
      );
    }

    let json: Record<string, unknown>;
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      throw new UploadAuraError(
        `UploadAura: server returned non-JSON response (HTTP ${res.status})`,
        res.status,
        "PARSE_ERROR",
      );
    }

    if (!res.ok) {
      const message =
        (typeof json["error"] === "string" && json["error"]) ||
        (typeof json["message"] === "string" ? json["message"] : `HTTP ${res.status}`);
      const code =
        (typeof json["errorCode"] === "string" && json["errorCode"]) ||
        "UNKNOWN_ERROR";
      throw new UploadAuraError(message, res.status, code);
    }

    const results = json["results"] as {
      message: string;
      data: UploadedFile[];
      failedCount: string;
    };

    return {
      files: results.data ?? [],
      failed: parseFailedCount(results.failedCount ?? ""),
      message: results.message ?? "",
    };
  }
}

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
    this.baseUrl = "https://uploadaurabackend.yaqoobhalepoto.dev/";
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

    const form = new FormData();

    for (const src of sources) {
      if (isBufferSource(src)) {
        if (src.buffer.length > MAX_BYTES) {
          throw new Error(
            `UploadAura: "${src.name}" is ${(src.buffer.length / 1024 / 1024).toFixed(1)} MB — exceeds the 100 MB limit`,
          );
        }
        form.append("files", src.buffer, {
          filename: src.name,
          contentType: src.type ?? "application/octet-stream",
          knownLength: src.buffer.length,
        });
      } else if (isStreamSource(src)) {
        // Stream size is unknown — backend enforces 100 MB server-side.
        form.append("files", src.stream, {
          filename: src.name,
          contentType: src.type ?? "application/octet-stream",
        });
      } else {
        // Path source
        const abs = path.resolve(src);
        let stat: fs.Stats;
        try {
          stat = fs.statSync(abs);
        } catch {
          throw new Error(`UploadAura: file not found — "${src}"`);
        }
        if (stat.size > MAX_BYTES) {
          throw new Error(
            `UploadAura: "${src}" is ${(stat.size / 1024 / 1024).toFixed(1)} MB — exceeds the 100 MB limit`,
          );
        }
        form.append("files", fs.createReadStream(abs), {
          filename: path.basename(abs),
          knownLength: stat.size,
        });
      }
    }

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/api/v1/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          // form-data sets the correct Content-Type with boundary
          ...form.getHeaders(),
        },
        // Node 18+ fetch (undici) accepts Node.js Readable as body
        body: form as unknown as any,
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
        typeof json["message"] === "string"
          ? json["message"]
          : `HTTP ${res.status}`;
      const code =
        typeof json["errorCode"] === "string"
          ? json["errorCode"]
          : "UNKNOWN_ERROR";
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

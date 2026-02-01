/**
 * Thrown by the UploadAura SDK whenever the server returns an error
 * or a request-level constraint is violated.
 *
 * @example
 * ```ts
 * import { UploadAura, UploadAuraError } from "uploadaura-sdk";
 *
 * try {
 *   await aura.upload("./huge.zip");
 * } catch (err) {
 *   if (err instanceof UploadAuraError) {
 *     console.error(err.message); // "Insufficient storage space."
 *     console.error(err.code);    // "INSUFFICIENT_STORAGE"
 *     console.error(err.status);  // 400
 *   }
 * }
 * ```
 */
export class UploadAuraError extends Error {
  /** HTTP status code returned by the server (or 0 for network errors). */
  readonly status: number;

  /**
   * Machine-readable error code from the server.
   * Common values: `"INSUFFICIENT_STORAGE"`, `"VALIDATION_ERROR"`,
   * `"ACCESS_UNAUTHORIZED"`, `"INTERNAL_SERVER_ERROR"`.
   */
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "UploadAuraError";
    this.status = status;
    this.code = code;
    // Maintain correct instanceof checks across transpilation targets.
    Object.setPrototypeOf(this, UploadAuraError.prototype);
  }
}

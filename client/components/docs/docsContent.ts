export const SECTIONS = [
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick start" },
  { id: "file-sources", label: "File sources" },
  { id: "api", label: "API reference" },
  { id: "errors", label: "Error handling" },
  { id: "constraints", label: "Constraints" },
  { id: "examples", label: "Examples" },
];

export const installCmd = "npm install uploadaura-sdk";

export const quickStart = `import { UploadAura } from "uploadaura-sdk";

const aura = new UploadAura({
  apiKey: "sk_live_your_key_here", // from the UploadAura dashboard
});

const { files, failed } = await aura.upload("./photo.jpg");

console.log(files[0].fileId);       // "64f1a2b3c4d5e6f7a8b9c0d1"
console.log(files[0].originalName);  // "photo.jpg"
console.log(files[0].size);          // 204800  (bytes)`;

export const pathSrc = `// Single file
await aura.upload("./report.pdf");

// Multiple files (max 10)
await aura.upload(["./a.jpg", "./b.png", "./c.pdf"]);`;

export const bufferSrc = `import fs from "node:fs";

const buffer = fs.readFileSync("./photo.jpg");

await aura.upload({
  buffer,
  name: "photo.jpg",                 // required: name with extension
  type: "image/jpeg",                // optional: defaults to application/octet-stream
});`;

export const streamSrc = `import fs from "node:fs";

const stream = fs.createReadStream("./data.csv");

await aura.upload({
  stream,
  name: "data.csv",
  type: "text/csv",
});`;

export const mixedSrc = `import fs from "node:fs";

await aura.upload([
  "./cover.jpg",
  { buffer: pdfBytes, name: "doc.pdf", type: "application/pdf" },
  { stream: fs.createReadStream("./log.txt"), name: "log.txt" },
]);`;

export const ctorTs = `interface UploadAuraConfig {
  /** Your API key from the dashboard. Must start with "sk_". */
  apiKey: string;
}`;

export const uploadSig = `// Accepts a single source or an array of up to 10 sources.
upload(files: FileSource | FileSource[]): Promise<UploadResult>

type FileSource =
  | string                 // path on disk
  | BufferSource          // { buffer, name, type? }
  | StreamSource          // { stream, name, type? }`;

export const returnTs = `interface UploadResult {
  files:   UploadedFile[]; // successfully uploaded files
  failed:  number;         // files that failed on the server
  message: string;         // human-readable summary
}

interface UploadedFile {
  fileId:       string;  // MongoDB ObjectId — share or manage this file
  originalName: string;
  size:         number;  // bytes
  ext:          string;  // e.g. "pdf", "jpg" (no dot)
  mimeType:     string;  // e.g. "application/pdf"
}`;

export const errorTs = `import { UploadAura, UploadAuraError } from "uploadaura-sdk";

try {
  await aura.upload("./huge.zip");
} catch (err) {
  if (err instanceof UploadAuraError) {
    console.error(err.message); // "Insufficient storage space."
    console.error(err.code);    // "INSUFFICIENT_STORAGE"
    console.error(err.status);  // 400
  }
}`;

export const expressEx = `import express from "express";
import { UploadAura, UploadAuraError } from "uploadaura-sdk";

const aura = new UploadAura({ apiKey: process.env.UPLOADAURA_API_KEY! });

const app = express();

app.post("/upload-avatar", express.raw({ type: "*/*", limit: "10mb" }), async (req, res) => {
  try {
    const { files } = await aura.upload({
      buffer: req.body as Buffer,
      name:   req.headers["x-filename"] as string ?? "avatar",
      type:   req.headers["content-type"] as string,
    });
    res.json({ fileId: files[0]?.fileId });
  } catch (err) {
    if (err instanceof UploadAuraError) {
      res.status(err.status || 500).json({ error: err.message, code: err.code });
    } else {
      res.status(500).json({ error: "Upload failed" });
    }
  }
});`;

export const cjsEx = `const { UploadAura, UploadAuraError } = require("uploadaura-sdk");

const aura = new UploadAura({ apiKey: "sk_live_..." });

aura.upload("./file.pdf")
  .then(({ files }) => console.log(files))
  .catch(console.error);`;

export const errorCodes = [
  { code: "INSUFFICIENT_STORAGE", status: "400", when: "Storage quota exceeded" },
  { code: "VALIDATION_ERROR", status: "400", when: "Invalid request body" },
  { code: "ACCESS_UNAUTHORIZED", status: "401", when: "Invalid or missing API key" },
  { code: "NETWORK_ERROR", status: "0", when: "Could not reach the backend" },
];

export const constraints = [
  { label: "Max files / request", value: "10" },
  { label: "Max file size", value: "100 MB" },
  { label: "Storage quota (free)", value: "2 GB" },
  { label: "Minimum Node.js", value: "18+" },
];

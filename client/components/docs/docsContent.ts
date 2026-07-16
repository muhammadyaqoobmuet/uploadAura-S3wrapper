export const SECTIONS = [
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick start" },
  { id: "file-sources", label: "File sources" },
  { id: "api", label: "API reference" },
  { id: "errors", label: "Error handling" },
  { id: "constraints", label: "Constraints" },
  { id: "examples", label: "Frameworks" },
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
  /**
   * Backend base URL (no trailing slash). Optional — resolved in this order:
   *   1. this value
   *   2. the UPLOADAURA_BASE_URL environment variable
   *   3. the hosted default https://uploadaurabackend.yaqoobhalepoto.dev
   */
  baseUrl?: string;
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
  url:          string;  // public, viewable URL: /files/:fileId/view
}`;

export const errorTs = `import { UploadAura, UploadAuraError } from "uploadaura-sdk";

try {
  await aura.upload("./huge.zip");
} catch (err) {
  if (err instanceof UploadAuraError) {
    console.error(err.message); // "Insufficient Storage . 123456 needed"
    console.error(err.code);    // "INSUFFICIENT_STORAGE"
    console.error(err.status);  // 400
  }
}`;

export const expressEx = `import express from "express";
import multer from "multer";
import { UploadAura, UploadAuraError } from "uploadaura-sdk";

const upload = multer(); // in-memory
const aura = new UploadAura({ apiKey: process.env.UPLOADAURA_API_KEY! });

const app = express();

app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const sources = (req.files as Express.Multer.File[]).map((f) => ({
      buffer: f.buffer,
      name: f.originalname,
      type: f.mimetype,
    }));
    const { files } = await aura.upload(sources);
    res.json({ files });
  } catch (err) {
    if (err instanceof UploadAuraError) {
      res.status(err.status || 500).json({ error: err.message, code: err.code });
    } else {
      res.status(500).json({ error: "Upload failed" });
    }
  }
});`;

export const nextjsEx = `// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UploadAura, UploadAuraError } from "uploadaura-sdk";

export const runtime = "nodejs"; // required: the SDK relies on Node APIs (fs, Buffer, streams)

const aura = new UploadAura({ apiKey: process.env.UPLOADAURA_API_KEY! });

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { files } = await aura.upload({
      buffer,
      name: file.name,
      type: file.type,
    });
    return NextResponse.json({ url: files[0].url });
  } catch (err) {
    if (err instanceof UploadAuraError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status || 500 },
      );
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}`;

export const nestjsEx = `import { Controller, Post, UploadedFiles, UseInterceptors, BadRequestException } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UploadAura, UploadAuraError } from "uploadaura-sdk";

const aura = new UploadAura({ apiKey: process.env.UPLOADAURA_API_KEY! });

@Controller("upload")
export class UploadController {
  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) throw new BadRequestException("No files");
    const sources = files.map((f) => ({
      buffer: f.buffer,
      name: f.originalname,
      type: f.mimetype,
    }));
    try {
      const { files: uploaded } = await aura.upload(sources);
      return { files: uploaded };
    } catch (err) {
      if (err instanceof UploadAuraError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}`;

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

// Flat, client-side searchable index (title + body text per section).
export const SEARCH_INDEX: { id: string; title: string; text: string }[] = [
  { id: "installation", title: "Installation", text: "install npm uploadaura-sdk get started" },
  { id: "quick-start", title: "Quick start", text: quickStart },
  {
    id: "file-sources",
    title: "File sources",
    text: `${pathSrc} ${bufferSrc} ${streamSrc} ${mixedSrc} path buffer stream mixed array`,
  },
  {
    id: "api",
    title: "API reference",
    text: `${ctorTs} ${uploadSig} ${returnTs} config apiKey baseUrl upload returns UploadResult UploadedFile`,
  },
  {
    id: "errors",
    title: "Error handling",
    text: `${errorTs} ${errorCodes.map((e) => `${e.code} ${e.status} ${e.when}`).join(" ")} UploadAuraError`,
  },
  {
    id: "constraints",
    title: "Constraints",
    text: `${constraints.map((c) => `${c.label} ${c.value}`).join(" ")} limits quota`,
  },
  {
    id: "examples",
    title: "Frameworks",
    text: `${expressEx} ${nextjsEx} ${nestjsEx} ${cjsEx} express nextjs nestjs node commonjs`,
  },
];

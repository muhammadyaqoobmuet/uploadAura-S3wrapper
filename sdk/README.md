# UploadAura SDK

Upload files to your UploadAura backend from any **Node.js** application — servers, APIs, and serverless functions. Accepts file **paths**, **Buffers**, and **Readable streams**.

> **Server-side only.** This SDK uses Node APIs (`fs`, `Buffer`, streams, `form-data`). It does **not** run in the browser or on the Edge runtime. In frameworks like Next.js, use it inside Route Handlers or Server Actions with the Node.js runtime.

---

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Authentication](#authentication)
- [Configuration](#configuration)
- [Uploading files](#uploading-files)
  - [File sources](#file-sources)
  - [Return value](#return-value)
- [Framework guides](#framework-guides)
  - [Express](#express)
  - [Next.js (App Router)](#nextjs-app-router)
  - [Plain Node.js / CommonJS](#plain-nodejs--commonjs)
- [Error handling](#error-handling)
- [Limits & quotas](#limits--quotas)
- [Raw HTTP (reference)](#raw-http-reference)

---

## Installation

```bash
npm install uploadaura-sdk
```

Requires **Node.js 18+**.

---

## Quick start

```ts
import { UploadAura } from "uploadaura-sdk";

const aura = new UploadAura({
  apiKey: process.env.UPLOADAURA_API_KEY!, // your sk_live_... key
});

const { files } = await aura.upload("./photo.jpg");

console.log(files[0].fileId); // "6a579538ca367101353ccc88"
console.log(files[0].url);    // "https://uploadaurabackend.yaqoobhalepoto.dev/files/.../view"
```

That's it — `baseUrl` defaults to the hosted backend, so no URL configuration is needed unless you run your own instance.

---

## Authentication

Every request is authenticated with an **API key** sent as a Bearer token:

```
Authorization: Bearer sk_live_your_key_here
```

- Create keys from the UploadAura dashboard (or `POST /api/apikey/create` on your backend while logged in).
- Keys look like `sk_live_<48 hex chars>`. The SDK rejects keys that don't start with `sk_`.
- The key is sent over HTTPS to `POST /api/v1/upload` with the file in the multipart field `files`.

You never build the request manually — the SDK handles the header, URL, and multipart body.

---

## Configuration

```ts
new UploadAura({
  apiKey:  string,                       // required
  baseUrl?: string,                      // optional
});
```

| Option    | Type     | Required | Resolved from                                                                 |
|-----------|----------|----------|-------------------------------------------------------------------------------|
| `apiKey`  | `string` | ✓        | —                                                                             |
| `baseUrl` | `string` |          | `config.baseUrl` → `process.env.UPLOADAURA_BASE_URL` → hosted default (`https://uploadaurabackend.yaqoobhalepoto.dev`) |

Pass `baseUrl` (or set `UPLOADAURA_BASE_URL`) to point at a self-hosted backend, e.g. `http://localhost:8000` during local development. Trailing slashes are stripped automatically.

---

## Uploading files

```ts
const result = await aura.upload(source);
```

`source` is a single `FileSource` or an array of up to **10** sources. Files are uploaded in one request.

### File sources

**Path** — a string pointing to a file on disk:

```ts
await aura.upload("./report.pdf");
```

**Multiple paths:**

```ts
await aura.upload(["./a.jpg", "./b.png", "./c.pdf"]);
```

**Buffer** — for files already in memory:

```ts
import fs from "node:fs";

const buffer = fs.readFileSync("./photo.jpg");

await aura.upload({
  buffer,
  name: "photo.jpg",    // required: filename with extension
  type: "image/jpeg",   // optional: MIME type (defaults to application/octet-stream)
});
```

**Stream** — for large files or piped data:

```ts
import fs from "node:fs";

const stream = fs.createReadStream("./data.csv");

await aura.upload({
  stream,
  name: "data.csv",
  type: "text/csv",
});
```

**Mixed array** — combine any of the above:

```ts
await aura.upload([
  "./cover.jpg",
  { buffer: pdfBytes, name: "doc.pdf", type: "application/pdf" },
  { stream: fs.createReadStream("./log.txt"), name: "log.txt" },
]);
```

> For paths and streams the SDK infers the MIME type from the file extension. For Buffers you should pass `type` yourself.

### Return value

```ts
interface UploadResult {
  files: UploadedFile[]; // successfully uploaded files
  failed: number;        // number of files that failed on the server (re-upload them)
  message: string;       // human-readable summary, e.g. "uploaded successfully 2 out of 2 files"
}

interface UploadedFile {
  fileId: string;  // stable id — use it to manage/share the file
  originalName: string;
  size: number;    // bytes
  ext: string;     // "pdf", "jpg" (no dot)
  mimeType: string; // "application/pdf"
  url: string;     // public, viewable URL: /files/:fileId/view
}
```

The `url` is a **public, browser-viewable URL** served by your backend's `/files/:fileId/view` endpoint (the file streams inline). Drop it straight into an `<img src>`, `<video>`, or `<a download>` on your frontend — no extra auth needed to view it.

```ts
const { files } = await aura.upload("./logo.png");
// files[0].url === "https://uploadaurabackend.yaqoobhalepoto.dev/files/<id>/view"
```

---

## Framework guides

### Express

Receive an upload from your client with `multer`, then forward it to UploadAura:

```ts
import express from "express";
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
});
```

### Next.js (App Router)

Use a **Route Handler** with the Node.js runtime. Convert the uploaded `File` to a `Buffer` before passing it to the SDK.

```ts
// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { UploadAura, UploadAuraError } from "uploadaura-sdk";

export const runtime = "nodejs"; // required: the SDK relies on Node APIs

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
}
```

The same pattern works inside a **Server Action** — just keep `export const runtime = "nodejs"` and never call the SDK from a Client Component.

### Plain Node.js / CommonJS

```js
const { UploadAura, UploadAuraError } = require("uploadaura-sdk");

const aura = new UploadAura({ apiKey: process.env.UPLOADAURA_API_KEY });

aura
  .upload("./file.pdf")
  .then(({ files }) => console.log(files[0].url))
  .catch((err) => {
    if (err instanceof UploadAuraError) console.error(err.code, err.message);
    else console.error(err);
  });
```

> **Serverless note:** on platforms like Vercel, set the function runtime to Node.js (the default for Route Handlers / `api/` functions). The SDK will not work on the Edge runtime.

---

## Error handling

Server-side errors throw `UploadAuraError`, which carries the HTTP `status` and a machine-readable `code`:

```ts
import { UploadAura, UploadAuraError } from "uploadaura-sdk";

try {
  await aura.upload("./huge.zip");
} catch (err) {
  if (err instanceof UploadAuraError) {
    console.error(err.message); // "Insufficient Storage . 123456 needed"
    console.error(err.code);    // "INSUFFICIENT_STORAGE"
    console.error(err.status);  // 400
  }
}
```

| Code                   | Status | When                                                |
|------------------------|--------|-----------------------------------------------------|
| `ACCESS_UNAUTHORIZED`  | 401    | Missing or invalid API key                         |
| `INSUFFICIENT_STORAGE` | 400    | Upload would exceed your account's storage quota   |
| `VALIDATION_ERROR`     | 400    | Invalid request (e.g. no files, bad field)         |
| `INTERNAL_SERVER_ERROR`| 500    | Something broke on the server                      |
| `NETWORK_ERROR`        | 0      | Could not reach the backend (DNS, timeout, offline)|

**Client-side** constraint violations (more than 10 files, or a file larger than 100 MB) throw a plain `Error` **before** any network request is made.

---

## Limits & quotas

| Limit                    | Value                |
|--------------------------|----------------------|
| Max files per request    | 10                   |
| Max size per file        | 100 MB               |
| Storage quota per account| 2 GB (default)       |

Exceeding the per-request limits throws locally. Exceeding your account quota returns `INSUFFICIENT_STORAGE` from the server.

---

## Raw HTTP (reference)

If you'd rather call the API directly (or debug), this is the exact contract the SDK uses:

```bash
curl -X POST https://uploadaurabackend.yaqoobhalepoto.dev/api/v1/upload \
  -H "Authorization: Bearer sk_live_your_key_here" \
  -F "files=@./photo.jpg"
```

```json
{
  "results": {
    "message": "uploaded successfully 1 out of 1 files ",
    "data": [
      {
        "fileId": "6a579538ca367101353ccc88",
        "originalName": "photo.jpg",
        "size": 204800,
        "ext": "jpg",
        "mimeType": "image/jpeg",
        "url": "https://uploadaurabackend.yaqoobhalepoto.dev/files/6a579538ca367101353ccc88/view"
      }
    ],
    "failedCount": "no failed count all uploaded successfully !"
  }
}
```

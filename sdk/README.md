# uploadaura-sdk

Upload files to your UploadAura backend from any Node.js app. Supports file paths, Buffers, and Readable streams.

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
  apiKey:  "sk_live_your_key_here",   // from the UploadAura dashboard
  baseUrl: "http://localhost:8000",    // your backend URL
});

const { files, failed } = await aura.upload("./photo.jpg");

console.log(files[0].fileId);      // "64f1a2b3c4d5e6f7a8b9c0d1"
console.log(files[0].originalName); // "photo.jpg"
console.log(files[0].size);         // 204800  (bytes)
```

---

## API

### `new UploadAura(config)`

| Option    | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `apiKey`  | `string` | ✓        | Your `sk_live_...` key from the dashboard |
| `baseUrl` | `string` |          | Backend base URL. Default: `http://localhost:8000` |

---

### `aura.upload(source)`

Upload one or more files. Returns a `Promise<UploadResult>`.

#### Accepted sources

**Path** — string pointing to a file on disk:

```ts
await aura.upload("./report.pdf");
```

**Multiple paths** — array of strings (max 10):

```ts
await aura.upload(["./a.jpg", "./b.png", "./c.pdf"]);
```

**Buffer** — for files already in memory:

```ts
import fs from "node:fs";

const buffer = fs.readFileSync("./photo.jpg");

await aura.upload({
  buffer,
  name: "photo.jpg",   // required: file name with extension
  type: "image/jpeg",  // optional: MIME type (defaults to application/octet-stream)
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

#### Return value — `UploadResult`

```ts
interface UploadResult {
  files:   UploadedFile[];  // successfully uploaded files
  failed:  number;          // files that failed on the server (re-upload them)
  message: string;          // human-readable summary
}

interface UploadedFile {
  fileId:       string;  // MongoDB ObjectId — use this to share or manage the file
  originalName: string;
  size:         number;  // bytes
  ext:          string;  // e.g. "pdf", "jpg" (no dot)
  mimeType:     string;  // e.g. "application/pdf"
}
```

---

## Error handling

All server-side errors throw `UploadAuraError`:

```ts
import { UploadAura, UploadAuraError } from "uploadaura-sdk";

try {
  await aura.upload("./huge.zip");
} catch (err) {
  if (err instanceof UploadAuraError) {
    console.error(err.message); // "Insufficient storage space."
    console.error(err.code);    // "INSUFFICIENT_STORAGE"
    console.error(err.status);  // 400
  }
}
```

| Code | Status | When |
|------|--------|------|
| `INSUFFICIENT_STORAGE` | 400 | Storage quota exceeded |
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `ACCESS_UNAUTHORIZED` | 401 | Invalid or missing API key |
| `NETWORK_ERROR` | 0 | Could not reach the backend |

Client-side constraint violations (too many files, file too large) throw a plain `Error` before any network request is made.

---

## Constraints

| Limit | Value |
|-------|-------|
| Max files per request | 10 |
| Max file size | 100 MB |
| Storage quota per account | 2 GB |

---

## CommonJS usage

```js
const { UploadAura, UploadAuraError } = require("uploadaura-sdk");

const aura = new UploadAura({
  apiKey:  "sk_live_...",
  baseUrl: "http://localhost:8000",
});

aura.upload("./file.pdf")
  .then(({ files }) => console.log(files))
  .catch(console.error);
```

---

## Express / serverless example

```ts
import express from "express";
import { UploadAura, UploadAuraError } from "uploadaura-sdk";

const aura = new UploadAura({
  apiKey:  process.env.UPLOADAURA_API_KEY!,
  baseUrl: process.env.UPLOADAURA_BASE_URL ?? "http://localhost:8000",
});

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
});
```

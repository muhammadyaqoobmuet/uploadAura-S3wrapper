import fs from "node:fs";
import path from "node:path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const dataDir = path.resolve(process.cwd(), "data");
const mdPath = path.join(dataDir, "docs.md");
const outPath = path.join(dataDir, "docsChunks.json");

const STOP = new Set(
  "the a an and or to of in for on with your you is are be this that it as from by if not can will our no at we use using when how what which into out up their them then than so do does did has have s t can't don't should must may might".split(
    " ",
  ),
);

const tokenize = (text: string): string[] =>
  (text.toLowerCase().match(/[a-z0-9_]+/g) ?? []).filter(
    (t) => t.length > 1 && !STOP.has(t),
  );

async function main() {
  const markdown = fs.readFileSync(mdPath, "utf-8");

  // Section-aware chunking: split on `## ` headings first, then on `### `
  // sub-sections, so each chunk is tagged with its SPECIFIC heading.
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 80,
    separators: ["\n\n", "\n", ". ", " "],
  });

  const sections = markdown.split(/\n## /);
  const texts: string[] = [];
  const pushSection = async (body: string, fallbackHeading: string) => {
    const headingMatch = body.match(/^##(?:#)?\s+(.+)$/m);
    const heading = headingMatch ? headingMatch[1].trim() : fallbackHeading;
    const subParts = body.split(/\n### /);
    for (let j = 0; j < subParts.length; j++) {
      const sub = (j === 0 ? subParts[j] : `### ${subParts[j]}`).trim();
      if (!sub) continue;
      const subHeadingMatch = sub.match(/^###\s+(.+)$/m);
      const subHeading = subHeadingMatch ? subHeadingMatch[1].trim() : heading;
      if (sub.length <= 700) {
        texts.push(`# ${subHeading}\n${sub}`);
        continue;
      }
      const docs = await splitter.createDocuments([sub]);
      docs.forEach((d) => texts.push(`# ${subHeading}\n${d.pageContent.trim()}`));
    }
  };
  for (let i = 0; i < sections.length; i++) {
    const body = (i === 0 ? sections[i] : `## ${sections[i]}`).trim();
    if (body) await pushSection(body, "");
  }

  // Document frequency across chunks
  const df = new Map<string, number>();
  for (const text of texts) {
    for (const t of new Set(tokenize(text))) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }
  const vocab = [...df.entries()]
    .filter(([, n]) => n >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4000)
    .map(([t]) => t);
  const idx = new Map(vocab.map((t, i) => [t, i]));
  const N = texts.length;

  const embed = (text: string): number[] => {
    const vec = new Array(vocab.length).fill(0);
    const lines = text.split("\n");
    lines.forEach((line, li) => {
      const weight = li === 0 ? 3 : 1;
      for (const t of tokenize(line)) {
        const i = idx.get(t);
        if (i === undefined) continue;
        vec[i] += (Math.log((1 + N) / (1 + (df.get(t) ?? 1))) + 1) * weight; // idf
      }
    });
    let norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map((v) => v / norm);
  };

  const chunks = texts.map((text, i) => ({
    id: `chunk-${i}`,
    text,
    embedding: embed(text),
  }));

  fs.writeFileSync(outPath, JSON.stringify(chunks, null, 2));
  console.log(`✓ Wrote ${chunks.length} chunks to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

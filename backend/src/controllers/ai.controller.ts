import type { Request, Response } from "express";
import { streamAnswer } from "../services/docsRag";

const MAX_WORDS = 700;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export async function docsChatController(req: Request, res: Response) {
  const question = (req.body?.question ?? "").toString().trim();
  if (!question) {
    res.status(400).json({ error: "Missing 'question' in request body." });
    return;
  }

  const words = countWords(question);
  if (words > MAX_WORDS) {
    res.status(400).json({
      error: `Question is too long (${words} words). Please keep it under ${MAX_WORDS} words.`,
    });
    return;
  }

  // Server-Sent Events style streaming.
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  try {
    for await (const token of streamAnswer(question)) {
      res.write(token);
    }
  } catch (err) {
    // If headers already sent, just close; otherwise return JSON error.
    if (!res.headersSent) {
      res.status(500).json({ error: "Chat failed. Check the server's GROQ_API_KEY." });
      return;
    }
    res.write("\n\n[error: the assistant stopped responding]");
  } finally {
    res.end();
  }
}


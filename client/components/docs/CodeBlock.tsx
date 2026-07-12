"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "const",
  "let",
  "var",
  "new",
  "await",
  "async",
  "return",
  "try",
  "catch",
  "if",
  "else",
  "function",
  "class",
  "extends",
  "interface",
  "type",
  "readonly",
  "for",
  "of",
  "throw",
  "typeof",
  "as",
  "require",
]);

const TOKEN_RE =
  /(\/\/[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b[A-Za-z_$][A-Za-z0-9_$]*\b)/g;

function renderTokens(code: string) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code))) {
    if (m.index > last) nodes.push(code.slice(last, m.index));
    const [full, comment, str, word] = m;
    if (comment) {
      nodes.push(
        <span key={key++} className="text-[var(--c-faint)] italic">
          {comment}
        </span>,
      );
    } else if (str) {
      nodes.push(
        <span key={key++} className="text-[var(--c-mut)]">
          {str}
        </span>,
      );
    } else if (word) {
      if (KEYWORDS.has(word)) {
        nodes.push(
          <span key={key++} className="text-[var(--c-fg)] font-semibold">
            {word}
          </span>,
        );
      } else if (/^[A-Z]/.test(word)) {
        nodes.push(
          <span key={key++} className="text-[var(--c-fg)]">
            {word}
          </span>,
        );
      } else {
        nodes.push(word);
      }
    } else {
      nodes.push(full);
    }
    last = m.index + full.length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}

export function CodeBlock({
  code,
  lang = "ts",
  filename,
}: {
  code: string;
  lang?: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="group relative my-5 overflow-hidden rounded-xl border border-[var(--c-code-border)] bg-[var(--c-code-bg)]">
      <div className="flex items-center justify-between border-b border-[var(--c-code-border)] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-faint)]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-faint)]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--c-faint)]/40" />
          {filename && (
            <span className="ml-3 font-[var(--font-doc-mono)] text-[11px] text-[var(--c-faint)]">
              {filename}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-[var(--c-mut)] transition-colors hover:bg-[var(--c-subtle-2)] hover:text-[var(--c-fg)]"
        >
          {copied ? (
            <>
              <Check size={13} /> Copied
            </>
          ) : (
            <>
              <Copy size={13} /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed text-[var(--c-code-fg)]">
        <code className="font-[var(--font-doc-mono)]">{renderTokens(code)}</code>
      </pre>
      <span className="pointer-events-none absolute right-3 top-2.5 hidden font-[var(--font-doc-mono)] text-[10px] uppercase tracking-wider text-[var(--c-faint)] opacity-0 transition-opacity group-hover:opacity-100">
        {lang}
      </span>
    </div>
  );
}

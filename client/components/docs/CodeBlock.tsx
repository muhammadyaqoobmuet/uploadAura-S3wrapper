"use client";

import { useEffect, useState } from "react";
import type { BundledLanguage } from "shiki";
import { transformerNotationHighlight } from "@shikijs/transformers";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type Props = {
  code: string;
  lang?: BundledLanguage;
  filename?: string;
};

export default function CodeBlock({ code, lang = "ts", filename }: Props) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { codeToHtml } = await import("shiki");
        const out = await codeToHtml(code, {
          lang,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
          transformers: [transformerNotationHighlight()],
        });
        if (active) setHtml(out);
      } catch {
        if (active) {
          setHtml(`<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [code, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="doc-codeblock">
      <div className="doc-codeblock-bar">
        <span className="doc-code-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="doc-code-file">{filename ?? lang}</span>
        <button type="button" className="doc-code-copy" onClick={copy} aria-label="Copy code">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div
        className="doc-codebody"
        dangerouslySetInnerHTML={{
          __html: html || `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`,
        }}
      />
    </div>
  );
}

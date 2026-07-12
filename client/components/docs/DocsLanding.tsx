"use client";

import "./docs.css";
import { useEffect, useRef, useState } from "react";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Search, Check, Copy, ArrowRight, ArrowLeft, BookOpen, Boxes, FileCode2, GitBranch, Terminal, Zap, ShieldCheck } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import {
  SECTIONS, installCmd, quickStart, pathSrc, bufferSrc, streamSrc, mixedSrc,
  ctorTs, uploadSig, returnTs, errorTs, expressEx, cjsEx, errorCodes, constraints,
} from "./docsContent";

const docFont = Manrope({ subsets: ["latin"], variable: "--font-doc", display: "swap" });
const docMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-doc-mono", display: "swap" });

type DocTheme = "light" | "dark";

function useDocTheme() {
  const [theme, setTheme] = useState<DocTheme>("light");
  useEffect(() => {
    const stored = (typeof localStorage !== "undefined" && localStorage.getItem("doc-theme")) as DocTheme | null;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("doc-dark", initial === "dark");
  }, []);
  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("doc-theme", next);
      document.documentElement.classList.toggle("doc-dark", next === "dark");
      return next;
    });
  };
  return { theme, toggle };
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

export default function DocsLanding() {
  const { theme, toggle } = useDocTheme();
  const active = useScrollSpy(SECTIONS.map((s) => s.id));
  const contentRef = useRef<HTMLDivElement>(null);

  const onSidebarClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const els = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(".doc-reveal") ?? []
    );
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 40, 200)}ms`;
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [contentRef]);

  return (
    <div className={`${docFont.variable} ${docMono.variable} doc-root`}>
      <header className="doc-header">
        <div className="doc-header-inner">
          <a href="https://github.com/muhammadyaqoobmuet/uploadAura-S3wrapper" className="doc-brand" target="_blank" rel="noreferrer">
            <span className="doc-brand-mark"><Boxes size={20} strokeWidth={1.6} /></span>
            <span className="doc-brand-name">UploadAura <span className="doc-brand-sub">SDK</span></span>
          </a>
          <div className="doc-header-actions">
            <button className="doc-search" type="button" aria-label="Search docs">
              <Search size={15} strokeWidth={1.8} />
              <span>Search</span>
              <kbd>⌘K</kbd>
            </button>
            <a href="https://github.com/muhammadyaqoobmuet/uploadAura-S3wrapper" className="doc-icon-btn" target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitBranch size={18} strokeWidth={1.7} />
            </a>
            <button className="doc-icon-btn" onClick={toggle} aria-label="Toggle theme" type="button">
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={18} strokeWidth={1.7} />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={18} strokeWidth={1.7} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <div className="doc-shell">
        <aside className="doc-sidebar">
          <div className="doc-sidebar-sticky">
            <p className="doc-side-label">Getting started</p>
            <nav className="doc-nav">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSidebarClick(s.id)}
                  className={`doc-nav-item ${active === s.id ? "is-active" : ""}`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
            <div className="doc-sidebar-foot">
              <ShieldCheck size={14} strokeWidth={1.7} />
              <span>v1.0 · MIT</span>
            </div>
          </div>
        </aside>

        <main className="doc-main" ref={contentRef}>
          <div className="doc-content">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="doc-hero"
            >
              <span className="doc-eyebrow"><Zap size={13} strokeWidth={2} /> UploadAura SDK</span>
              <h1 className="doc-title">Ship uploads in three lines.</h1>
              <p className="doc-lede">
                A zero-dependency Node.js client for the UploadAura file API. Point it at a path,
                a <code>Buffer</code>, or a stream — get back stable file IDs.
              </p>
              <div className="doc-hero-meta">
                <span><Terminal size={14} strokeWidth={1.7} /> Node 18+</span>
                <span><FileCode2 size={14} strokeWidth={1.7} /> TypeScript</span>
                <span><Boxes size={14} strokeWidth={1.7} /> 0 deps</span>
              </div>
            </motion.div>

            <section id="installation" className="doc-section doc-reveal">
              <h2 className="doc-h2"><span className="doc-h2-idx">01</span>Installation</h2>
              <p className="doc-p">Install from npm. The SDK ships its own types — no <code>@types</code> needed.</p>
              <CodeBlock code={installCmd} lang="bash" />
            </section>

            <section id="quick-start" className="doc-section doc-reveal">
              <h2 className="doc-h2"><span className="doc-h2-idx">02</span>Quick start</h2>
              <p className="doc-p">Create a client with your API key, then upload. Files resolve to a typed result.</p>
              <CodeBlock code={quickStart} lang="ts" />
            </section>

            <section id="file-sources" className="doc-section doc-reveal">
              <h2 className="doc-h2"><span className="doc-h2-idx">03</span>File sources</h2>
              <p className="doc-p">
                <code>upload()</code> accepts a path, an in-memory buffer, a readable stream, or an array
                mixing all three (up to 10 files per call).
              </p>
              <h3 className="doc-h3">Path</h3>
              <CodeBlock code={pathSrc} lang="ts" />
              <h3 className="doc-h3">Buffer</h3>
              <CodeBlock code={bufferSrc} lang="ts" />
              <h3 className="doc-h3">Stream</h3>
              <CodeBlock code={streamSrc} lang="ts" />
              <h3 className="doc-h3">Mixed array</h3>
              <CodeBlock code={mixedSrc} lang="ts" />
            </section>

            <section id="api" className="doc-section doc-reveal">
              <h2 className="doc-h2"><span className="doc-h2-idx">04</span>API reference</h2>

              <h3 className="doc-h3">new UploadAura(config)</h3>
              <CodeBlock code={ctorTs} lang="ts" />

              <h3 className="doc-h3">aura.upload(files)</h3>
              <CodeBlock code={uploadSig} lang="ts" />

              <h3 className="doc-h3">Returns</h3>
              <CodeBlock code={returnTs} lang="ts" />
            </section>

            <section id="errors" className="doc-section doc-reveal">
              <h2 className="doc-h2"><span className="doc-h2-idx">05</span>Error handling</h2>
              <p className="doc-p">
                Network and validation failures throw a typed <code>UploadAuraError</code> with a stable
                <code>code</code> you can branch on.
              </p>
              <CodeBlock code={errorTs} lang="ts" />

              <div className="doc-table-wrap">
                <table className="doc-table">
                  <thead>
                    <tr><th>Code</th><th>HTTP</th><th>When</th></tr>
                  </thead>
                  <tbody>
                    {errorCodes.map((e) => (
                      <tr key={e.code}>
                        <td><code>{e.code}</code></td>
                        <td>{e.status}</td>
                        <td>{e.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="constraints" className="doc-section doc-reveal">
              <h2 className="doc-h2"><span className="doc-h2-idx">06</span>Constraints</h2>
              <div className="doc-constraints">
                {constraints.map((c) => (
                  <div key={c.label} className="doc-constraint">
                    <span className="doc-constraint-val">{c.value}</span>
                    <span className="doc-constraint-label">{c.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="examples" className="doc-section doc-reveal">
              <h2 className="doc-h2"><span className="doc-h2-idx">07</span>Examples</h2>

              <h3 className="doc-h3">Express route</h3>
              <CodeBlock code={expressEx} lang="ts" />

              <h3 className="doc-h3">CommonJS</h3>
              <CodeBlock code={cjsEx} lang="ts" />

              <div className="doc-callout">
                <BookOpen size={16} strokeWidth={1.8} />
                <p>Need a signed URL or resumable upload? The REST API mirrors this SDK 1:1. See <code>/api/docs</code> in your dashboard.</p>
              </div>
            </section>

            <nav className="doc-pager">
              <a href="#installation" className="doc-pager-prev" onClick={(e) => { e.preventDefault(); onSidebarClick("installation"); }}>
                <ArrowLeft size={16} strokeWidth={1.8} />
                <span><small>Start</small>Installation</span>
              </a>
              <a href="#examples" className="doc-pager-next" onClick={(e) => { e.preventDefault(); onSidebarClick("examples"); }}>
                <span><small>End</small>Examples</span>
                <ArrowRight size={16} strokeWidth={1.8} />
              </a>
            </nav>
          </div>
        </main>

        <aside className="doc-toc">
          <div className="doc-toc-sticky">
            <p className="doc-toc-label">On this page</p>
            <nav className="doc-toc-nav">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSidebarClick(s.id)}
                  className={`doc-toc-item ${active === s.id ? "is-active" : ""}`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}

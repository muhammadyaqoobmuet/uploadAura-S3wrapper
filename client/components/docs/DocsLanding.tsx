"use client";

import "./docs.css";
import { useEffect, useRef, useState } from "react";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Moon,
  Sun,
  Search,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Boxes,
  FileCode2,
  Terminal,
  Zap,
  ShieldCheck,
} from "lucide-react";
import CodeBlock from "./CodeBlock";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  SECTIONS,
  installCmd,
  quickStart,
  pathSrc,
  bufferSrc,
  streamSrc,
  mixedSrc,
  ctorTs,
  uploadSig,
  returnTs,
  errorTs,
  expressEx,
  nextjsEx,
  nestjsEx,
  cjsEx,
  errorCodes,
  constraints,
  SEARCH_INDEX,
} from "./docsContent";

const docFont = Manrope({
  subsets: ["latin"],
  variable: "--font-doc",
  display: "swap",
});
const docMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-doc-mono",
  display: "swap",
});

type DocTheme = "light" | "dark";

function GitHubMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function useDocTheme() {
  const [theme, setTheme] = useState<DocTheme>("light");
  useEffect(() => {
    const stored = (typeof localStorage !== "undefined" &&
      localStorage.getItem("doc-theme")) as DocTheme | null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
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

function useScrollSpy(ids: string[], offset = 110) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const pos = window.scrollY + offset;
        let current = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= pos) current = id;
        }
        setActive((prev) => (prev === current ? prev : current));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);
  return active;
}

const GITHUB_URL = "https://github.com/muhammadyaqoobmuet/uploadAura-S3wrapper";

export default function DocsLanding() {
  const { theme, toggle } = useDocTheme();
  const active = useScrollSpy(SECTIONS.map((s) => s.id));
  const contentRef = useRef<HTMLDivElement>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onSidebarClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Reveal-on-scroll (with a guaranteed-visible fallback so content never stays hidden).
  useEffect(() => {
    const els = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(".doc-reveal") ?? [],
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 40, 200)}ms`;
      obs.observe(el);
    });
    const fallback = setTimeout(
      () => els.forEach((el) => el.classList.add("is-in")),
      1600,
    );
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, [contentRef]);

  // Search: open with Cmd/Ctrl+K, close with Escape, submit with Enter.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => searchInputRef.current?.focus(), 30);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [searchOpen]);

  const results = query.trim()
    ? SEARCH_INDEX.filter((item) =>
        `${item.title} ${item.text}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ).slice(0, 8)
    : [];

  const goTo = (id: string) => {
    setSearchOpen(false);
    onSidebarClick(id);
  };

  return (
    <div className={`${docFont.variable} ${docMono.variable} doc-root`}>
      <header className="doc-header">
        <div className="doc-header-inner">
          <Link
            href="/docs"
            className="doc-brand"
            aria-label="UploadAura SDK docs"
          >
            <BrandLogo className="h-[26px] w-auto" />
          </Link>
          <div className="doc-header-actions">
            <button
              className="doc-search"
              type="button"
              aria-label="Search docs"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={15} strokeWidth={1.8} />
              <span>Search</span>
              <kbd>⌘K</kbd>
            </button>
            <a
              href={GITHUB_URL}
              className="doc-icon-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <GitHubMark />
            </a>
            <button
              className="doc-icon-btn"
              onClick={toggle}
              aria-label="Toggle theme"
              type="button"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} strokeWidth={1.7} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
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
              <span className="doc-eyebrow">
                <Zap size={13} strokeWidth={2} /> UploadAura SDK
              </span>
              <h1 className="doc-title">Ship uploads in three lines.</h1>
              <p className="doc-lede">
                A small Node.js client for the UploadAura file API. Point it at
                a path, a <code>Buffer</code>, or a stream — get back stable
                file IDs and public URLs.
              </p>
              <div className="doc-hero-meta">
                <span>
                  <Terminal size={14} strokeWidth={1.7} /> Node 18+
                </span>
                <span>
                  <FileCode2 size={14} strokeWidth={1.7} /> TypeScript
                </span>
                <span>
                  <Boxes size={14} strokeWidth={1.7} /> Server-side
                </span>
              </div>
            </motion.div>

            <section id="installation" className="doc-section doc-reveal">
              <h2 className="doc-h2">
                <span className="doc-h2-idx">01</span>Installation
              </h2>
              <p className="doc-p">
                Install from npm. The SDK ships its own types — no{" "}
                <code>@types</code> needed.
              </p>
              <CodeBlock code={installCmd} lang="bash" />
            </section>

            <section id="quick-start" className="doc-section doc-reveal">
              <h2 className="doc-h2">
                <span className="doc-h2-idx">02</span>Quick start
              </h2>
              <p className="doc-p">
                Create a client with your API key, then upload. Files resolve to
                a typed result.
              </p>
              <CodeBlock code={quickStart} lang="ts" />
            </section>

            <section id="file-sources" className="doc-section doc-reveal">
              <h2 className="doc-h2">
                <span className="doc-h2-idx">03</span>File sources
              </h2>
              <p className="doc-p">
                <code>upload()</code> accepts a path, an in-memory buffer, a
                readable stream, or an array mixing all three (up to 10 files
                per call).
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
              <h2 className="doc-h2">
                <span className="doc-h2-idx">04</span>API reference
              </h2>

              <h3 className="doc-h3">new UploadAura(config)</h3>
              <CodeBlock code={ctorTs} lang="ts" />

              <h3 className="doc-h3">aura.upload(files)</h3>
              <CodeBlock code={uploadSig} lang="ts" />

              <h3 className="doc-h3">Returns</h3>
              <CodeBlock code={returnTs} lang="ts" />
            </section>

            <section id="errors" className="doc-section doc-reveal">
              <h2 className="doc-h2">
                <span className="doc-h2-idx">05</span>Error handling
              </h2>
              <p className="doc-p">
                Network and validation failures throw a typed{" "}
                <code>UploadAuraError</code> with a stable
                <code>code</code> you can branch on.
              </p>
              <CodeBlock code={errorTs} lang="ts" />

              <div className="doc-table-wrap">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>HTTP</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorCodes.map((e) => (
                      <tr key={e.code}>
                        <td>
                          <code>{e.code}</code>
                        </td>
                        <td>{e.status}</td>
                        <td>{e.when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="constraints" className="doc-section doc-reveal">
              <h2 className="doc-h2">
                <span className="doc-h2-idx">06</span>Constraints
              </h2>
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
              <h2 className="doc-h2">
                <span className="doc-h2-idx">07</span>Frameworks
              </h2>
              <p className="doc-p">
                The SDK is server-side only (Node APIs). Drop it into your
                backend — an Express route, a Next.js Route Handler, or a NestJS
                controller — and forward the upload.
              </p>

              <h3 className="doc-h3">Express</h3>
              <CodeBlock code={expressEx} lang="ts" filename="server.ts" />

              <h3 className="doc-h3">Next.js (App Router)</h3>
              <CodeBlock
                code={nextjsEx}
                lang="ts"
                filename="app/api/upload/route.ts"
              />

              <h3 className="doc-h3">NestJS</h3>
              <CodeBlock
                code={nestjsEx}
                lang="ts"
                filename="upload.controller.ts"
              />

              <h3 className="doc-h3">Plain Node.js / CommonJS</h3>
              <CodeBlock code={cjsEx} lang="ts" filename="upload.js" />

              <div className="doc-callout">
                <BookOpen size={16} strokeWidth={1.8} />
                <p>
                  Need a signed URL or resumable upload? The REST API mirrors
                  this SDK 1:1 — see <code>POST /api/v1/upload</code> with{" "}
                  <code>Authorization: Bearer &lt;key&gt;</code>.
                </p>
              </div>
            </section>

            <nav className="doc-pager">
              <a
                href="#installation"
                className="doc-pager-prev"
                onClick={(e) => {
                  e.preventDefault();
                  onSidebarClick("installation");
                }}
              >
                <ArrowLeft size={16} strokeWidth={1.8} />
                <span>
                  <small>Start</small>Installation
                </span>
              </a>
              <a
                href="#examples"
                className="doc-pager-next"
                onClick={(e) => {
                  e.preventDefault();
                  onSidebarClick("examples");
                }}
              >
                <span>
                  <small>End</small>Frameworks
                </span>
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

      {searchOpen && (
        <div
          className="doc-search-overlay"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="doc-search-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="doc-search-field">
              <Search size={16} strokeWidth={1.8} />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) goTo(results[0].id);
                }}
                placeholder="Search the docs…"
              />
              <kbd>Esc</kbd>
            </div>
            <div className="doc-search-results">
              {query.trim() === "" ? (
                <p className="doc-search-hint">
                  Start typing to filter sections, code, and errors.
                </p>
              ) : results.length === 0 ? (
                <p className="doc-search-hint">No matches for “{query}”.</p>
              ) : (
                results.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className="doc-search-result"
                    onClick={() => goTo(r.id)}
                  >
                    <span className="doc-search-result-title">{r.title}</span>
                    <span className="doc-search-result-go">
                      <ArrowRight size={14} strokeWidth={1.8} />
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

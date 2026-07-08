"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";

/**
 * Cargo landing page — Next.js component
 * -----------------------------------------------------------
 * Drop this file in as e.g. app/components/CargoLanding.jsx
 * (or pages-dir equivalent) and render it directly:
 *
 *   import CargoLanding from "./components/CargoLanding";
 *   export default function Page() { return <CargoLanding />; }
 *
 * Notes on what changed vs. the original static HTML:
 * 1. The "Storage / SDK / API / Delivery / Analytics" pill-tab
 *    row (with the ← → arrows) under the hero has been removed.
 * 2. The API card no longer pretends to expose a small REST
 *    surface (POST /v2/files/upload, GET /v2/files/:id). It now
 *    shows the one thing that's actually true today: a single
 *    endpoint you can hit directly with your key, rendered as a
 *    little terminal snippet with a blinking caret.
 * 3. The "Instant URLs" card's dashed line + moving dot was
 *    replaced with a proper SVG path + CSS `offset-path` motion
 *    animation that only plays on hover, so it reads as an
 *    intentional detail rather than a looping gif.
 * 4. A new footer was built in the same sharp-shadow / noise /
 *    dotted-texture language as the rest of the page, with a
 *    live-status chip, real link columns, and a social row.
 * -----------------------------------------------------------
 */

const FAQS = [
  {
    q: "Is this a new storage service, or a wrapper?",
    a: "A wrapper. Your files live in your own S3 bucket — Cargo just gives you one API and SDK instead of raw AWS calls, IAM policies, and bucket configuration.",
  },
  {
    q: "Do I need an AWS account first?",
    a: "No. Cargo provisions and manages the underlying bucket for you on the free tier. On Pro plans you can also connect your own AWS account if you want direct ownership.",
  },
  {
    q: "What happens if I go over 2GB?",
    a: "Uploads past the free limit are paused, not deleted. You'll get a notice with a one-click upgrade — nothing you've already stored is ever removed.",
  },
  {
    q: "Which languages does the SDK support?",
    a: "Node, Python, and Go today, with the same method names and response shapes across all three. A REST endpoint sits underneath, so any language can call it directly.",
  },
  {
    q: "Can I make uploaded files private?",
    a: "Yes — every file defaults to a public URL, but you can flip a file or an entire folder to private and issue short-lived signed links instead.",
  },
];

export default function CargoLanding() {
  const [openFaq, setOpenFaq] = useState(null);
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef([]);
  revealRefs.current = [];

  const addRevealRef = (el: any) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleCopy = () => {
    setCopied(true);
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  };

  return (
    <div className="cargo-page">
      {/* ============ NAV ============ */}
      <nav className="navbar">
        <div
          className="nav-shell"
          style={{
            paddingLeft: scrolled ? 52 : 24,
            paddingRight: scrolled ? 36 : 12,
            paddingTop: 8,
            paddingBottom: 8,
            transition: "padding 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="logo">
            <div className="logo-icon"></div>
            <span>
              Upload<span style={{ color: "var(--accent)" }}>Aura</span>
            </span>
          </div>
          <ul className="nav-links">
            <li>
              <a href="#plan">Product</a>
            </li>
            <li>
              <a href="#showcase">Watch it work</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
            <li>
              <a href="#">Docs</a>
            </li>
          </ul>
          <div className="nav-right">
            {isLoggedIn ? (
              <button
                className="btn-primary btn-dashboard"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutGrid size={13} aria-hidden="true" />
                Dashboard
              </button>
            ) : (
              <>
                <button
                  className="btn-manage"
                  onClick={() => router.push("/login")}
                >
                  Sign in
                </button>
                <button
                  className="btn-primary"
                  onClick={() => router.push("/register")}
                >
                  Get API key
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="badges">
          <div className="badge">
            <span className="star-green">★</span>
            <span>2 GB free forever</span>
          </div>
          <div className="badge-divider"></div>
          <div className="badge">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF603D"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>No AWS console needed</span>
          </div>
        </div>

        <h1>
          One
          <span className="inline-icon">
            <span className="icon-key">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="7.5" cy="15.5" r="4" />
                <path d="M10.5 12.5 L21 2" />
                <path d="M17 6 L20 9" />
                <path d="M14 9 L17 12" />
              </svg>
            </span>
          </span>
          key. Every file on
          <span className="inline-icon">
            <span className="icon-s3">
              <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient
                    id="s3grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#F58536" />
                    <stop offset="55%" stopColor="#E25D2C" />
                    <stop offset="100%" stopColor="#B7311D" />
                  </linearGradient>
                  <linearGradient id="s3top" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F9A26C" />
                    <stop offset="100%" stopColor="#E25D2C" />
                  </linearGradient>
                </defs>
                <path
                  d="M14 20 L18 60 Q40 66 62 60 L66 20 Q40 28 14 20 Z"
                  fill="url(#s3grad)"
                />
                <ellipse cx="40" cy="20" rx="26" ry="6" fill="url(#s3top)" />
                <ellipse
                  cx="40"
                  cy="18"
                  rx="20"
                  ry="3"
                  fill="rgba(255,255,255,0.3)"
                />
                <path
                  d="M18 25 Q40 33 62 25"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.2"
                  fill="none"
                />
                <text
                  x="40"
                  y="52"
                  textAnchor="middle"
                  fill="white"
                  fontFamily="Inter, sans-serif"
                  fontWeight="800"
                  fontSize="17"
                  letterSpacing="-0.5"
                >
                  S3
                </text>
              </svg>
            </span>
          </span>
          .
        </h1>

        <p className="subtitle">
          One API call. A permanent CDN URL back instantly. No S3 setup, no IAM
          policies, no presigned URL plumbing. File storage built to get out of
          your way.
        </p>

        <div className="hero-ctas">
          <button
            className="cta-button"
            onClick={() => router.push("/register")}
          >
            <svg
              className="cta-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="7.5" cy="15.5" r="3.5" />
              <path d="M10.5 12.5 L21 2" />
              <path d="M17.5 5.5 L20 8" />
              <path d="M15 8 L17.5 10.5" />
            </svg>
            <span>Get your free API key</span>
            <span className="arrow">→</span>
          </button>
          <a href="#showcase" className="btn-ghost">
            <span className="ghost-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </span>
            Watch it work
          </a>
        </div>
      </section>

      {/* ============ STAGE — DASHBOARD PREVIEW ============ */}
      <section className="relative py-20 lg:py-32 overflow-hidden flex items-center justify-center">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-center">
          <div className="flex justify-center ">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF6B45]/20 blur-[150px] rounded-full" />
            {/* Outer Glow */}
            <div className="relative w-full max-w-6xl flex items-center justify-center">
              <div className="absolute -inset-10 bg-[#FF6B45]/15 blur-[120px] rounded-full" />

              {/* Border Layer 1 */}
              <div className="rounded-[32px] bg-gradient-to-b from-white/20 via-white/10 to-white/5 p-[1px]">
                {/* Border Layer 2 */}
                <div className="rounded-[31px] bg-gradient-to-b from-white/10 to-transparent p-[1px]">
                  {/* Glass Layer */}
                  <div className="rounded-[30px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] overflow-hidden">
                    <Image
                      src="/landing.png"
                      width={1000}
                      height={900}
                      alt="Dashboard Preview"
                      priority
                      className="block w-full h-auto object-cover scale-[1.07]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EVERYTHING, ON ONE PLAN — BENTO ============ */}
      <section className="plan-section" id="plan">
        <div className="wrap">
          <div className="plan-head reveal" ref={addRevealRef}>
            <span className="eyebrow">What ships</span>
            <h2>
              Everything, on <span className="accent">one plan</span>
            </h2>
            <p>
              A tight bundle of primitives so you never have to reach past Cargo
              for another service.
            </p>
          </div>

          <div className="plan-grid ">
            {/* 01 Storage — featured */}
            <div className="plan-card card-storage reveal" ref={addRevealRef}>
              <div className="card-top">
                <div className="plan-icon">
                  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient
                        id="cardS3grad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#F58536" />
                        <stop offset="100%" stopColor="#B7311D" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M14 20 L18 60 Q40 66 62 60 L66 20 Q40 28 14 20 Z"
                      fill="url(#cardS3grad)"
                    />
                    <ellipse cx="40" cy="20" rx="26" ry="6" fill="#E25D2C" />
                    <ellipse
                      cx="40"
                      cy="18"
                      rx="20"
                      ry="3"
                      fill="rgba(255,255,255,0.35)"
                    />
                    <text
                      x="40"
                      y="52"
                      textAnchor="middle"
                      fill="white"
                      fontFamily="Inter, sans-serif"
                      fontWeight="800"
                      fontSize="17"
                    >
                      S3
                    </text>
                  </svg>
                </div>
                <span className="plan-num">01 · STORAGE</span>
              </div>
              <div className="card-body">
                <div className="big-num">
                  2<span className="unit">GB</span>
                </div>
                <div className="sub-note">Free forever · No card needed</div>
              </div>
              <div className="card-body">
                <h3 style={{ marginTop: 16 }}>Room to build</h3>
                <p>
                  Unlimited files across the free tier, backed by S3. Nothing
                  you upload is ever quietly deleted.
                </p>
              </div>
            </div>

            {/* 02 SDK */}
            <div className="plan-card card-sdk reveal" ref={addRevealRef}>
              <div className="max-w-2xl  rounded-2xl">
                <Image
                  src="/benoimage.png"
                  alt="SDK"
                  width={1000}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="card-body ">
                <h3>Typed clients, one shape</h3>
                <p>
                  Same method names and response types across every language.
                </p>
              </div>
            </div>

            {/* 03 API — text top, image bottom */}
            <div
              className=" relative plan-card card-api reveal  "
              ref={addRevealRef}
            >
              <div className="card-api-content absolute top-0 left-0 w-full">
                <div className="card-top">
                  <div className="plan-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 17l6-6-6-6" />
                      <path d="M12 19h8" />
                    </svg>
                  </div>
                  <span className="plan-num">03 · API</span>
                </div>
                <h3>One key, one endpoint</h3>
                <p className="text-sm text-muted-foreground max-w-[330px]">
                  No route map to learn. POST once, get a permanent CDN URL back
                  instantly.
                </p>
              </div>
              <div className="card-api-img-bottom ">
                <Image
                  src="/benoimage2.png"
                  alt="API Preview"
                  width={1200}
                  height={300}
                  className="api-bottom-img h-[450px] object-contain! bg-center! "
                />
              </div>
            </div>

            {/* 04 Delivery — Instant URLs with a real motion-path micro-interaction */}
            <div className="plan-card card-delivery reveal" ref={addRevealRef}>
              <div className="card-top">
                <div className="plan-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
                    <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
                  </svg>
                </div>
                <span className="plan-num">04</span>
              </div>
              <div className="card-body">
                <h3>Instant URLs</h3>
                <p>Every file gets a permanent link the moment it lands.</p>
                <div className="url-viz">
                  <span className="file-badge">FILE</span>
                  <div className="url-flow">
                    <svg
                      className="flow-svg"
                      viewBox="0 0 154 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 12 C 40 -2, 114 26, 150 12"
                        stroke="var(--border-strong)"
                        strokeWidth="1.4"
                        strokeDasharray="1 6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="flow-dot" aria-hidden="true"></span>
                  </div>
                  <span
                    className={`url-chip${copied ? " copied" : ""}`}
                    onClick={handleCopy}
                    role="button"
                    tabIndex={0}
                  >
                    {copied ? "copied ✓" : "cdn/…"}
                  </span>
                </div>
              </div>
            </div>

            {/* 05 Analytics */}
            <div className="plan-card card-analytics reveal" ref={addRevealRef}>
              <div className="card-top">
                <div className="plan-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M7 15l4-4 3 3 5-6" />
                  </svg>
                </div>
                <span className="plan-num">05</span>
              </div>
              <div className="card-body">
                <h3>Live analytics</h3>
                <p>
                  Storage and usage update as files move — no second dashboard.
                </p>
                <div className="mini-chart">
                  <div className="chart-bars">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                  </div>
                  <div className="chart-legend">
                    <span>MON</span>
                    <span>SUN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 06 Security */}
            <div className="plan-card card-security reveal" ref={addRevealRef}>
              <div className="card-top">
                <div className="plan-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </div>
                <span className="plan-num">06</span>
              </div>
              <div className="card-body">
                <h3>Private by choice</h3>
                <p>Flip files or folders to private and issue signed links.</p>
                <div className="sec-viz">
                  <div className="lock-badge">
                    <svg viewBox="0 0 24 24">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  </div>
                  <div className="sec-meta">
                    <span className="sec-title">End-to-end encrypted</span>
                    <div className="sec-tags">
                      <span className="sec-tag">AES-256</span>
                      <span className="sec-tag">TLS 1.3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SHOWCASE ============ */}
      <section className="showcase" id="showcase">
        <div className="wrap showcase-flex">
          <div className="showcase-text reveal" ref={addRevealRef}>
            <span className="eyebrow">Watch it work</span>
            <h2>One upload, start to URL</h2>
            <p>
              Drop a file in, and Cargo handles the rest — storage, indexing,
              and a public link, in one pass.
            </p>
            <ul className="showcase-list">
              <li>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                No bucket setup before your first call
              </li>
              <li>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                No pre-signed URLs to generate by hand
              </li>
              <li>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Works the same from a script or a browser
              </li>
            </ul>
            <a href="#" className="btn-ghost">
              Read the SDK docs →
            </a>
          </div>

          <div className="showcase-video reveal" ref={addRevealRef}>
            <div className="video-frame">
              <span className="frame-label">CARGO — LIVE UPLOAD</span>
              <div className="video-placeholder">
                <div className="play-btn">
                  <svg viewBox="0 0 24 24">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="faq-head reveal" ref={addRevealRef}>
            <span className="eyebrow">Questions</span>
            <h2>Before you start</h2>
          </div>

          <div className="faq-list">
            {FAQS.map((item, i) => (
              <div
                className={`faq-item${openFaq === i ? " open" : ""}`}
                key={item.q}
              >
                <button
                  className="faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <span className="plus">+</span>
                </button>
                <div
                  className="faq-a"
                  style={{ maxHeight: openFaq === i ? 200 : 0 }}
                >
                  <div className="faq-a-inner">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <div className="footer-glow" aria-hidden="true"></div>
        <div className="footer-dots" aria-hidden="true"></div>

        <div className="wrap footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon"></div>
                <span>UploadAura</span>
              </div>
              <p className="footer-tagline">
                A thin, typed layer over Amazon S3 — one key, every file.
              </p>
              <div className="footer-status">
                <span className="dot"></span>
                All systems operational
              </div>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#plan">What ships</a>
                </li>
                <li>
                  <a href="#showcase">Watch it work</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">Changelog</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Developers</h4>
              <ul>
                <li>
                  <a href="#">Docs</a>
                </li>
                <li>
                  <a href="#">SDK reference</a>
                </li>
                <li>
                  <a href="#">Status</a>
                </li>
                <li>
                  <a href="#">GitHub</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="foot-fine">
              © 2026 UploadAura — Cloud Storage API
            </span>
            <div className="footer-right">
              <span className="footer-built">
                <svg
                  viewBox="0 0 80 80"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: 14, height: 14 }}
                >
                  <path
                    d="M14 20 L18 60 Q40 66 62 60 L66 20 Q40 28 14 20 Z"
                    fill="#E25D2C"
                  />
                  <ellipse cx="40" cy="20" rx="26" ry="6" fill="#F58536" />
                </svg>
                Built on Amazon S3
              </span>
              <div className="footer-social">
                <a href="#" aria-label="GitHub">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
                  </svg>
                </a>
                <a href="#" aria-label="Twitter / X">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 4l16 16M20 4L4 20" />
                  </svg>
                </a>
                <a href="#" aria-label="Status">
                  <svg viewBox="0 0 24 24">
                    <path d="M13 2 3 14h8l-1 8 11-14h-9l1-6z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --ink: #0f0f10;
          --ink-2: #2d2d2f;
          --muted: #6e6c67;
          --faint: #a7a49d;
          --border: #eae8e3;
          --border-2: #e1dfda;
          --border-strong: #d6d3cc;
          --bg: #ffffff;
          --bg-2: #fafaf9;
          --bg-3: #f5f3ee;
          --accent: #ff603d;
          --accent-2: #ff7a45;
          --accent-3: #ff8c5a;
          --accent-deep: #e5461f;
          --accent-hover: #e5502e;
          --accent-soft: #ffe8de;
          --font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono: "IBM Plex Mono", monospace;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        img,
        video,
        svg {
          display: block;
          max-width: 100%;
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
          .reveal {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <style jsx>{`
        .cargo-page {
          overflow-x: clip;
          position: relative;
          font-family: var(--font-body);
        }
        .wrap {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .eyebrow {
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ============ NAV ============ */
        .navbar {
          display: flex;
          justify-content: center;
          padding: 18px 24px;
          position: sticky;
          top: 0;
          z-index: 100;
          background: transparent;
        }
        .nav-shell {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px 8px 24px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border: 1px solid rgba(234, 232, 227, 0.9);
          border-radius: 999px;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 -1px 0 rgba(0, 0, 0, 0.04) inset,
            0 4px 20px rgba(0, 0, 0, 0.05),
            0 12px 40px -12px rgba(0, 0, 0, 0.1);
          max-width: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 13px;
          color: var(--ink);
          letter-spacing: 0.4px;
          padding-right: 14px;
          border-right: 1px solid var(--border);
          margin-right: 6px;
        }
        .logo-icon {
          width: 26px;
          height: 26px;
          background: linear-gradient(135deg, #1a1a1a, #000);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow:
            0 2px 6px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }
        .logo-icon::before {
          content: "";
          width: 18px;
          height: 18px;
          border: 2px solid var(--accent);
          border-radius: 50%;
          position: absolute;
          box-shadow: 0 0 8px rgba(255, 96, 61, 0.4);
        }
        .logo-icon::after {
          content: "";
          width: 4px;
          height: 4px;
          background: var(--accent);
          border-radius: 50%;
          position: absolute;
          box-shadow: 0 0 6px rgba(255, 96, 61, 0.8);
        }
        .nav-links {
          display: flex;
          gap: 2px;
          list-style: none;
        }
        .nav-links a {
          color: var(--ink-2);
          font-size: 13.5px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 14px;
          border-radius: 999px;
          transition: all 0.2s;
        }
        .nav-links a:hover {
          color: var(--ink);
          background: rgba(0, 0, 0, 0.04);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 8px;
        }
        .btn-manage {
          padding: 9px 16px;
          background: transparent;
          border: none;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          color: var(--ink-2);
          font-family: inherit;
          transition: all 0.2s;
        }
        .btn-manage:hover {
          color: var(--ink);
          background: rgba(0, 0, 0, 0.04);
        }

        .btn-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: linear-gradient(
            180deg,
            var(--accent-2) 0%,
            var(--accent) 55%,
            var(--accent-deep) 100%
          );
          color: white;
          border: none;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.1px;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.5) inset,
            0 -1px 0 rgba(0, 0, 0, 0.22) inset,
            0 0 0 1px rgba(229, 70, 31, 0.35),
            0 2px 4px rgba(229, 70, 31, 0.25),
            0 8px 16px -4px rgba(255, 96, 61, 0.45),
            0 14px 30px -8px rgba(255, 96, 61, 0.35);
          transition:
            transform 0.15s ease,
            box-shadow 0.25s ease,
            filter 0.2s ease;
        }
        .btn-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0) 45%
          );
          pointer-events: none;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.55) inset,
            0 -1px 0 rgba(0, 0, 0, 0.24) inset,
            0 0 0 1px rgba(229, 70, 31, 0.4),
            0 3px 6px rgba(229, 70, 31, 0.3),
            0 12px 22px -4px rgba(255, 96, 61, 0.55),
            0 20px 40px -8px rgba(255, 96, 61, 0.45);
        }
        .btn-primary:active {
          transform: translateY(0);
          filter: brightness(0.97);
        }

        /* ============ HERO ============ */
        .hero {
          text-align: center;
          padding: 60px 20px 90px;
          position: relative;
          z-index: 3;
        }
        .badges {
          display: inline-flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 30px;
          padding: 6px 16px;
          margin-bottom: 30px;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 2px 8px rgba(0, 0, 0, 0.04),
            0 8px 20px -8px rgba(0, 0, 0, 0.06);
        }
        .badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--ink);
        }
        .badge-divider {
          width: 1px;
          background: var(--border);
          margin: 0 4px;
        }
        .badge svg {
          width: 14px;
          height: 14px;
        }
        .star-green {
          color: #00b67a;
          font-size: 14px;
        }
        .hero h1 {
          font-size: 62px;
          font-weight: 700;
          line-height: 1.08;
          margin-bottom: 24px;
          letter-spacing: -1.8px;
          color: var(--ink);
          max-width: 950px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero h1 .inline-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          margin: 0 6px;
          transform: translateY(-4px);
        }
        .hero h1 .inline-icon > * {
          animation: float 4s ease-in-out infinite;
        }
        .hero h1 .inline-icon:nth-of-type(2) > * {
          animation-delay: -2s;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(-4px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .icon-s3 {
          width: 72px;
          height: 72px;
          background: linear-gradient(160deg, #ffffff 0%, #fafaf9 100%);
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 -1px 0 rgba(0, 0, 0, 0.06) inset,
            0 0 0 1px var(--border),
            0 6px 14px rgba(226, 93, 44, 0.18),
            0 14px 32px -8px rgba(226, 93, 44, 0.28);
          position: relative;
          transition: transform 0.3s ease;
        }
        .icon-s3:hover {
          transform: translateY(-2px) rotate(-2deg);
        }
        .icon-s3 svg {
          width: 46px;
          height: 46px;
        }
        .icon-key {
          width: 72px;
          height: 72px;
          background: linear-gradient(
            160deg,
            #ff8c5a 0%,
            #ff603d 50%,
            #e5461f 100%
          );
          border-radius: 16px;
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.45) inset,
            0 -1px 0 rgba(0, 0, 0, 0.2) inset,
            0 0 0 1px rgba(229, 70, 31, 0.4),
            0 6px 14px rgba(255, 96, 61, 0.35),
            0 14px 32px -8px rgba(255, 96, 61, 0.5);
          position: relative;
          transition: transform 0.3s ease;
        }
        .icon-key:hover {
          transform: translateY(-2px) rotate(2deg);
        }
        .icon-key::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.25) 0%,
            transparent 50%
          );
          pointer-events: none;
        }
        .icon-key svg {
          width: 36px;
          height: 36px;
          position: relative;
          z-index: 1;
        }

        .hero p.subtitle {
          font-size: 18px;
          color: var(--ink-2);
          margin-bottom: 34px;
          font-weight: 400;
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.55;
        }
        .hero-ctas {
          display: inline-flex;
          gap: 32px;
          align-items: center;
        }
        .cta-button .cta-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .btn-ghost .ghost-chevron {
          width: 13px;
          height: 13px;
          flex-shrink: 0;
          transition: transform 0.22s ease;
        }
        .btn-ghost:hover .ghost-chevron {
          transform: translateX(3px);
        }
        /* Social proof stats */
        .hero-stats {
          display: inline-flex;
          align-items: center;
          gap: 28px;
          margin-top: 36px;
          padding: 14px 28px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 999px;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 2px 12px rgba(0, 0, 0, 0.04);
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        .stat-val {
          font-size: 16px;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: -0.4px;
          line-height: 1;
        }
        .stat-lbl {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .stat-divider {
          width: 1px;
          height: 28px;
          background: var(--border);
        }

        .cta-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 17px 34px;
          background: linear-gradient(
            180deg,
            var(--accent-2) 0%,
            var(--accent) 55%,
            var(--accent-deep) 100%
          );
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition:
            transform 0.15s ease,
            box-shadow 0.25s ease,
            filter 0.2s ease;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.5) inset,
            0 -1px 0 rgba(0, 0, 0, 0.25) inset,
            0 0 0 1px rgba(229, 70, 31, 0.4),
            0 3px 6px rgba(229, 70, 31, 0.3),
            0 12px 24px -4px rgba(255, 96, 61, 0.5),
            0 24px 48px -8px rgba(255, 96, 61, 0.4);
          overflow: hidden;
        }
        .cta-button::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0) 45%
          );
          pointer-events: none;
        }
        .cta-button::after {
          content: "";
          position: absolute;
          top: 0;
          left: -60%;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.7s ease;
          pointer-events: none;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.55) inset,
            0 -1px 0 rgba(0, 0, 0, 0.28) inset,
            0 0 0 1px rgba(229, 70, 31, 0.45),
            0 4px 8px rgba(229, 70, 31, 0.35),
            0 18px 32px -4px rgba(255, 96, 61, 0.6),
            0 32px 60px -8px rgba(255, 96, 61, 0.5);
        }
        .cta-button:hover::after {
          left: 120%;
        }
        .cta-button:active {
          transform: translateY(0);
        }
        .cta-button .arrow {
          transition: transform 0.25s ease;
          position: relative;
          z-index: 1;
        }
        .cta-button:hover .arrow {
          transform: translateX(4px);
        }
        .cta-button span:not(.arrow) {
          position: relative;
          z-index: 1;
        }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: var(--muted);
          border-bottom: 1px solid var(--border-2);
          padding-bottom: 3px;
          font-weight: 500;
          transition:
            color 0.2s,
            border-color 0.2s;
        }
        .btn-ghost:hover {
          color: var(--ink);
          border-color: var(--ink);
        }

        /* ============ STAGE ============ */
        .stage {
          position: relative;
          padding: 20px 0 100px;
          margin-top: 0;
          overflow: hidden;
        }
        .stage-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse 900px 500px at 50% 40%,
              rgba(255, 96, 61, 0.14),
              transparent 70%
            ),
            radial-gradient(
              ellipse 500px 300px at 20% 20%,
              rgba(255, 138, 90, 0.08),
              transparent 70%
            ),
            radial-gradient(
              ellipse 500px 300px at 80% 20%,
              rgba(255, 138, 90, 0.08),
              transparent 70%
            );
        }
        .stage-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(
            ellipse 800px 500px at center,
            black 30%,
            transparent 80%
          );
          -webkit-mask-image: radial-gradient(
            ellipse 800px 500px at center,
            black 30%,
            transparent 80%
          );
        }
        .stage-inner {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          padding: 0 24px;
        }
        .browser-outer {
          position: relative;
          padding: 14px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.9),
            rgba(255, 255, 255, 0.5)
          );
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 1) inset,
            0 0 0 1px rgba(234, 232, 227, 0.8),
            0 30px 80px -20px rgba(255, 96, 61, 0.25),
            0 60px 120px -30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          max-width: 1110px;
          width: 100%;
        }
        .browser-outer::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: linear-gradient(
            135deg,
            rgba(255, 96, 61, 0.4),
            transparent 40%,
            transparent 60%,
            rgba(255, 96, 61, 0.25)
          );
          z-index: -1;
          filter: blur(2px);
          opacity: 0.7;
        }
        .browser-outer .corner {
          position: absolute;
          width: 22px;
          height: 22px;
          border: 2px solid var(--accent);
          opacity: 0.9;
        }
        .browser-outer .corner.tl {
          top: -6px;
          left: -6px;
          border-right: none;
          border-bottom: none;
          border-top-left-radius: 6px;
        }
        .browser-outer .corner.tr {
          top: -6px;
          right: -6px;
          border-left: none;
          border-bottom: none;
          border-top-right-radius: 6px;
        }
        .browser-outer .corner.bl {
          bottom: -6px;
          left: -6px;
          border-right: none;
          border-top: none;
          border-bottom-left-radius: 6px;
        }
        .browser-outer .corner.br {
          bottom: -6px;
          right: -6px;
          border-left: none;
          border-top: none;
          border-bottom-right-radius: 6px;
        }
        .browser-frame {
          width: 100%;
          background: #1e1e1e;
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.08) inset,
            0 0 0 1px rgba(255, 255, 255, 0.06),
            0 20px 50px rgba(0, 0, 0, 0.35);
        }
        .browser-topbar {
          background: linear-gradient(180deg, #2f2f2f, #262626);
          padding: 12px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #1a1a1a;
        }
        .browser-dots {
          display: flex;
          gap: 7px;
        }
        .browser-dots span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: block;
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.3) inset;
        }
        .browser-dots span:nth-child(1) {
          background: #ff5f56;
        }
        .browser-dots span:nth-child(2) {
          background: #ffbd2e;
        }
        .browser-dots span:nth-child(3) {
          background: #27c93f;
        }
        .browser-url {
          flex: 1;
          background: #1a1a1a;
          border-radius: 6px;
          padding: 6px 14px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: #888;
          text-align: center;
          max-width: 380px;
          margin: 0 auto;
        }
        .browser-body {
          background: #0f0f0f;
          aspect-ratio: 16/9;
          display: grid;
          grid-template-columns: 220px 1fr 260px;
          gap: 0;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #ccc;
          position: relative;
          overflow: hidden;
        }
        .dash-side {
          background: #161616;
          border-right: 1px solid #262626;
          padding: 18px 14px;
        }
        .dash-side-title {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 12px;
          color: #fff;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dash-side-title::before {
          content: "";
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255, 96, 61, 0.6);
        }
        .dash-file {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 8px;
          border-radius: 6px;
          font-size: 11px;
          color: #999;
          margin-bottom: 3px;
          transition: background 0.15s;
        }
        .dash-file.active {
          background: rgba(255, 96, 61, 0.12);
          color: #fff;
        }
        .dash-file .file-ico {
          width: 14px;
          height: 14px;
          border-radius: 3px;
          background: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 700;
          color: #999;
          flex-shrink: 0;
        }
        .dash-file.active .file-ico {
          background: var(--accent);
          color: #fff;
        }
        .dash-main {
          background: #0f0f0f;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dash-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 96, 61, 0.15);
          border: 1px solid rgba(255, 96, 61, 0.3);
          border-radius: 20px;
          padding: 4px 10px;
          font-size: 10px;
          color: var(--accent-2);
        }
        .dash-tag::before {
          content: "";
          width: 5px;
          height: 5px;
          background: var(--accent);
          border-radius: 50%;
          animation: dashPulse 2s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(255, 96, 61, 0.8);
        }
        @keyframes dashPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        .dash-time {
          font-size: 10px;
          color: #666;
        }
        .dash-canvas {
          flex: 1;
          background: linear-gradient(135deg, #1a1a1a 0%, #202020 100%);
          border-radius: 10px;
          border: 1px solid #262626;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .dash-upload-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #ddd;
        }
        .dash-progress {
          height: 4px;
          background: #262626;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        .dash-progress-fill {
          height: 100%;
          width: 78%;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          border-radius: 4px;
          box-shadow: 0 0 8px rgba(255, 96, 61, 0.6);
        }
        .dash-url-row {
          background: #0a0a0a;
          border: 1px solid #262626;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 10.5px;
          color: #66cc99;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .dash-url-row .cp {
          color: var(--accent-2);
          font-size: 9px;
          cursor: pointer;
        }
        .dash-code-block {
          background: #0a0a0a;
          border: 1px solid #1e1e1e;
          border-radius: 8px;
          padding: 14px;
          font-size: 10.5px;
          line-height: 1.7;
          color: #d4d4d4;
          overflow: hidden;
        }
        .dash-code-block .kw {
          color: #c586c0;
        }
        .dash-code-block .st {
          color: #ce9178;
        }
        .dash-code-block .fn {
          color: #dcdcaa;
        }
        .dash-code-block .co {
          color: #6a9955;
        }
        .dash-code-block .va {
          color: #9cdcfe;
        }
        .dash-right {
          background: #161616;
          border-left: 1px solid #262626;
          padding: 18px 16px;
        }
        .dash-right-title {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 12px;
          color: #fff;
          margin-bottom: 14px;
        }
        .dash-stat {
          padding: 10px 0;
          border-bottom: 1px solid #1e1e1e;
        }
        .dash-stat:last-child {
          border-bottom: none;
        }
        .dash-stat-label {
          font-size: 9.5px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .dash-stat-value {
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }
        .dash-stat-value .sub {
          font-size: 10px;
          color: #666;
          font-weight: 400;
          margin-left: 4px;
        }
        .dash-bar {
          height: 3px;
          background: #262626;
          border-radius: 3px;
          margin-top: 8px;
          overflow: hidden;
        }
        .dash-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
        }

        /* ============ PLAN / BENTO ============ */
        .plan-section {
          padding: 100px 0 100px;
          position: relative;
          background: linear-gradient(180deg, #ffffff 0%, var(--bg-2) 100%);
        }
        .plan-head {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 72px;
        }
        .plan-head .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: var(--accent-soft);
          border: 1px solid rgba(255, 96, 61, 0.2);
          border-radius: 20px;
          color: var(--accent);
          margin-bottom: 22px;
        }
        .plan-head .eyebrow::before {
          content: "";
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(255, 96, 61, 0.6);
        }
        .plan-head h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          letter-spacing: -1.2px;
          margin-bottom: 18px;
          line-height: 1.1;
          color: var(--ink);
        }
        .plan-head h2 .accent {
          color: var(--accent);
          font-style: italic;
          font-weight: 700;
        }
        .plan-head p {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
        }
        .plan-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: minmax(180px, auto);
          gap: 18px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .plan-card {
          position: relative;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          overflow: hidden;
          transition:
            transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1),
            border-color 0.3s ease,
            box-shadow 0.35s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 200px;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 1px 2px rgba(0, 0, 0, 0.04),
            0 8px 20px -12px rgba(0, 0, 0, 0.08);
        }
        .plan-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(255, 96, 61, 0.18) 1px,
            transparent 0
          );
          background-size: 14px 14px;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          mask-image: linear-gradient(180deg, black 0%, transparent 70%);
          -webkit-mask-image: linear-gradient(
            180deg,
            black 0%,
            transparent 70%
          );
        }
        .plan-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 96, 61, 0.4);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 0 0 1px rgba(255, 96, 61, 0.15),
            0 20px 40px rgba(255, 96, 61, 0.12),
            0 8px 20px rgba(0, 0, 0, 0.06);
        }
        .plan-card:hover::before {
          opacity: 1;
        }
        .card-storage {
          grid-column: span 3;
        }
        .card-sdk {
          grid-column: span 3;
        }
        .card-api {
          grid-column: span 6;
          padding: 0;
          flex-direction: column;
          max-height: 400px;
        }
        .card-api-content {
          padding: 28px 32px 20px;
        }
        .card-api-content .card-top {
          margin-bottom: 14px;
        }
        .card-api-img-bottom {
          flex: 1;
          overflow: hidden;
          background: #f4f5f7;
          border-top: 1px solid rgba(0, 0, 0, 0.07);
        }
        .api-bottom-img {
          width: 100%;
          height: 1000px;
          object-fit: contain;
          object-position: top top;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .card-api:hover .api-bottom-img {
          transform: scale(1.025);
        }
        .card-delivery,
        .card-analytics,
        .card-security {
          grid-column: span 2;
          justify-content: flex-start;
        }
        .card-delivery .card-top,
        .card-analytics .card-top,
        .card-security .card-top {
          margin-bottom: 14px;
        }
        .plan-card .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }
        .plan-card .card-body {
          position: relative;
          z-index: 2;
        }
        .plan-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #ffffff 0%, #fafaf9 100%);
          border: 1px solid rgba(234, 232, 227, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 -1px 0 rgba(0, 0, 0, 0.04) inset,
            0 2px 6px rgba(0, 0, 0, 0.05),
            0 8px 16px -6px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }
        .plan-card:hover .plan-icon {
          transform: rotate(-3deg) scale(1.05);
        }
        .plan-icon svg {
          width: 28px;
          height: 28px;
        }
        .plan-num {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--faint);
          letter-spacing: 0.1em;
          background: var(--bg-2);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--border);
          font-weight: 500;
        }
        .plan-card h3 {
          font-size: 22px;
          font-weight: 750;
          letter-spacing: -0.55px;
          margin-bottom: 10px;
          line-height: 1.2;
          color: radial-gradient(
            ellipse 400px 200px at 100% 0%,
            rgba(255, 255, 255, 0.25),
            transparent 60%
          );
        }
        .plan-card p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.55;
        }

        .card-storage {
          background:
            radial-gradient(
              ellipse 400px 200px at 100% 0%,
              rgba(255, 255, 255, 0.25),
              transparent 60%
            ),
            radial-gradient(
              ellipse 300px 200px at 0% 100%,
              rgba(229, 70, 31, 0.5),
              transparent 60%
            ),
            linear-gradient(135deg, #ff8c5a 0%, #ff603d 45%, #e5461f 100%);
          border: 1px solid rgba(229, 70, 31, 0.6);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.35) inset,
            0 -1px 0 rgba(0, 0, 0, 0.2) inset,
            0 0 0 1px rgba(229, 70, 31, 0.3),
            0 4px 10px rgba(229, 70, 31, 0.25),
            0 20px 40px -10px rgba(255, 96, 61, 0.45),
            0 40px 80px -20px rgba(255, 96, 61, 0.35);
        }
        .card-storage::before {
          background-image:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.4'/></svg>"),
            radial-gradient(
              circle at 1px 1px,
              rgba(255, 255, 255, 0.22) 1px,
              transparent 0
            );
          background-size:
            240px 240px,
            16px 16px;
          opacity: 1;
          mask-image: linear-gradient(
            180deg,
            black 0%,
            black 60%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            180deg,
            black 0%,
            black 60%,
            transparent 100%
          );
          mix-blend-mode: overlay;
        }
        .card-storage::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 220px;
          height: 220px;
          background: conic-gradient(
            from 180deg at 100% 0%,
            rgba(255, 255, 255, 0.15) 0deg,
            transparent 90deg
          );
          pointer-events: none;
        }
        .card-storage:hover {
          transform: translateY(-6px);
          border-color: rgba(229, 70, 31, 0.7);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.4) inset,
            0 -1px 0 rgba(0, 0, 0, 0.22) inset,
            0 0 0 1px rgba(229, 70, 31, 0.35),
            0 6px 14px rgba(229, 70, 31, 0.3),
            0 30px 60px -10px rgba(255, 96, 61, 0.55),
            0 60px 120px -20px rgba(255, 96, 61, 0.45);
        }
        .card-storage .plan-icon {
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(8px);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.4) inset,
            0 -1px 0 rgba(0, 0, 0, 0.1) inset,
            0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .card-storage .plan-num {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
          color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(6px);
        }
        .card-storage h3,
        .card-storage p {
          color: white;
        }
        .card-storage p {
          color: rgba(255, 255, 255, 0.9);
        }
        .card-storage .big-num {
          font-size: 84px;
          font-weight: 800;
          letter-spacing: -4px;
          color: white;
          line-height: 1;
          margin: 28px 0 8px;
          text-shadow:
            0 2px 20px rgba(0, 0, 0, 0.2),
            0 4px 40px rgba(229, 70, 31, 0.4);
          position: relative;
        }
        .card-storage .big-num .unit {
          font-size: 30px;
          font-weight: 600;
          opacity: 0.9;
          margin-left: 4px;
          text-shadow: none;
        }
        .card-storage .sub-note {
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 30px;
          backdrop-filter: blur(6px);
        }
        .card-storage .sub-note::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          animation: dashPulse 2s ease-in-out infinite;
        }

        /* ===== API card: single-endpoint terminal ===== */
        .card-api .endpoint-preview {
          margin-top: 14px;
          background: linear-gradient(180deg, #1a1a1a, #141414);
          border: 1px solid #262626;
          border-radius: 10px;
          padding: 14px 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #d4d4d4;
          line-height: 1.85;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.05) inset,
            0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .endpoint-preview .term-dot-row {
          display: flex;
          gap: 5px;
          margin-bottom: 10px;
        }
        .endpoint-preview .term-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #333;
        }
        .endpoint-preview .term-line {
          white-space: pre;
          overflow-x: auto;
        }
        .endpoint-preview .term-indent {
          padding-left: 14px;
          color: #a8a8a8;
        }
        .endpoint-preview .prompt {
          color: var(--accent-2);
          font-weight: 600;
        }
        .endpoint-preview .term-str {
          color: #ce9178;
        }
        .endpoint-preview .term-out {
          color: #66cc99;
          margin-top: 6px;
        }
        .endpoint-preview .cursor {
          display: inline-block;
          width: 6px;
          height: 12px;
          background: #66cc99;
          margin-left: 4px;
          transform: translateY(2px);
          animation: caretBlink 1s steps(1) infinite;
        }
        @keyframes caretBlink {
          50% {
            opacity: 0;
          }
        }

        /* ===== Delivery card: SVG path + motion-path micro-interaction ===== */
        .card-delivery .url-viz {
          margin-top: 16px;
          background: linear-gradient(180deg, #fafaf9, #f5f3ee);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset;
        }
        .card-delivery .file-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 7px;
          background: rgba(255, 96, 61, 0.12);
          color: var(--accent-deep);
          border: 1px solid rgba(255, 96, 61, 0.25);
          border-radius: 6px;
          font-weight: 600;
          font-size: 9.5px;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .url-flow {
          position: relative;
          flex: 1;
          height: 24px;
          display: flex;
          align-items: center;
        }
        .flow-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .flow-dot {
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px rgba(255, 96, 61, 0.7);
          opacity: 0;
          offset-path: path("M4 12 C 40 -2, 114 26, 150 12");
          offset-distance: 0%;
          offset-rotate: 0deg;
        }
        .flow-dot {
          animation: travelPath 1.6s ease-in-out infinite;
        }
        @keyframes travelPath {
          0% {
            offset-distance: 0%;
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
          }
        }
        .card-delivery .flow-svg path {
          stroke: var(--accent);
          opacity: 0.9;
        }
        .url-chip {
          padding: 3px 7px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--ink);
          font-weight: 600;
          font-size: 9.5px;
          flex-shrink: 0;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.15s ease;
        }
        .url-chip:hover {
          border-color: var(--accent);
          color: var(--accent-deep);
        }
        .url-chip:active {
          transform: scale(0.94);
        }
        .url-chip.copied {
          border-color: #00b67a;
          color: #00b67a;
        }

        /* ===== Analytics ===== */
        .card-analytics .mini-chart {
          margin-top: 16px;
          padding: 12px 14px 10px;
          background: linear-gradient(180deg, #fafaf9, #f5f3ee);
          border: 1px solid var(--border);
          border-radius: 10px;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset;
          position: relative;
        }
        .card-analytics .chart-bars {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 48px;
        }
        @keyframes barPulse {
          0%,
          100% {
            transform: scaleY(0.72);
            opacity: 0.65;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        .card-analytics .chart-bars .bar {
          flex: 1;
          background: linear-gradient(180deg, var(--accent-2), var(--accent));
          border-radius: 3px 3px 0 0;
          opacity: 1;
          box-shadow: 0 2px 4px rgba(255, 96, 61, 0.2);
          transform-origin: bottom center;
          animation: barPulse 2.8s ease-in-out infinite;
        }
        .card-analytics .chart-bars .bar:nth-child(1) {
          height: 30%;
          animation-delay: 0s;
        }
        .card-analytics .chart-bars .bar:nth-child(2) {
          height: 55%;
          animation-delay: 0.35s;
        }
        .card-analytics .chart-bars .bar:nth-child(3) {
          height: 42%;
          animation-delay: 0.7s;
        }
        .card-analytics .chart-bars .bar:nth-child(4) {
          height: 78%;
          animation-delay: 1.05s;
        }
        .card-analytics .chart-bars .bar:nth-child(5) {
          height: 62%;
          animation-delay: 1.4s;
        }
        .card-analytics .chart-bars .bar:nth-child(6) {
          height: 88%;
          animation-delay: 1.75s;
        }
        .card-analytics .chart-bars .bar:nth-child(7) {
          height: 70%;
          animation-delay: 2.1s;
        }
        .card-analytics .chart-bars .bar:nth-child(8) {
          height: 100%;
          animation-delay: 2.45s;
        }
        .card-analytics .chart-legend {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--faint);
          margin-top: 8px;
          padding-top: 6px;
          border-top: 1px dashed var(--border-2);
          letter-spacing: 0.06em;
        }

        /* ===== Security ===== */
        .card-security .sec-viz {
          margin-top: 16px;
          padding: 12px 14px;
          background: linear-gradient(180deg, #fafaf9, #f5f3ee);
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset;
        }
        @keyframes lockGlow {
          0%,
          100% {
            box-shadow:
              0 1px 0 rgba(255, 255, 255, 0.4) inset,
              0 -1px 0 rgba(0, 0, 0, 0.2) inset,
              0 4px 10px rgba(255, 96, 61, 0.35);
          }
          50% {
            box-shadow:
              0 1px 0 rgba(255, 255, 255, 0.4) inset,
              0 -1px 0 rgba(0, 0, 0, 0.2) inset,
              0 4px 20px rgba(255, 96, 61, 0.65),
              0 0 28px rgba(255, 96, 61, 0.25);
          }
        }
        .card-security .lock-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(
            135deg,
            var(--accent-2),
            var(--accent-deep)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lockGlow 2.6s ease-in-out infinite;
          flex-shrink: 0;
        }
        .card-security .lock-badge svg {
          width: 16px;
          height: 16px;
          stroke: white;
          stroke-width: 2.2;
          fill: none;
        }
        .card-security .sec-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .card-security .sec-title {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          color: var(--ink);
        }
        .card-security .sec-tags {
          display: flex;
          gap: 4px;
        }
        .card-security .sec-tag {
          font-family: var(--font-mono);
          font-size: 9px;
          padding: 2px 6px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--muted);
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        /* ===== SDK ===== */
        .card-sdk .sdk-langs {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        .sdk-lang {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: linear-gradient(180deg, #fff, #fafaf9);
          font-size: 12px;
          font-weight: 600;
          color: var(--ink-2);
          font-family: var(--font-body);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 1px 3px rgba(0, 0, 0, 0.03);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease;
        }
        .sdk-lang:hover {
          transform: translateY(-1px);
          border-color: var(--accent);
        }
        .sdk-lang .lang-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
        }
        .sdk-lang.node .lang-dot {
          background: #339933;
          box-shadow:
            0 0 0 2px rgba(51, 153, 51, 0.15),
            0 0 8px rgba(51, 153, 51, 0.4);
        }
        .sdk-lang.python .lang-dot {
          background: #3776ab;
          box-shadow:
            0 0 0 2px rgba(55, 118, 171, 0.15),
            0 0 8px rgba(55, 118, 171, 0.4);
        }
        .sdk-lang.go .lang-dot {
          background: #00add8;
          box-shadow:
            0 0 0 2px rgba(0, 173, 216, 0.15),
            0 0 8px rgba(0, 173, 216, 0.4);
        }

        @media (max-width: 900px) {
          .plan-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .card-storage {
            grid-column: span 2;
            grid-row: auto;
          }
          .card-sdk,
          .card-api,
          .card-delivery,
          .card-analytics,
          .card-security {
            grid-column: span 2;
          }
        }

        /* ============ SHOWCASE ============ */
        .showcase {
          padding: 100px 0 120px;
          border-top: 1px solid var(--border);
        }
        .showcase-flex {
          display: flex;
          align-items: center;
          gap: 64px;
        }
        .showcase-text {
          flex: 0 0 40%;
        }
        .showcase-text .eyebrow {
          display: block;
          margin-bottom: 14px;
        }
        .showcase-text h2 {
          font-size: clamp(1.8rem, 3.2vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.8px;
          margin-bottom: 16px;
          line-height: 1.15;
        }
        .showcase-text p {
          color: var(--muted);
          font-size: 16px;
          max-width: 36ch;
          margin-bottom: 26px;
        }
        .showcase-list {
          list-style: none;
          margin-bottom: 28px;
        }
        .showcase-list li {
          font-size: 14.5px;
          color: var(--ink-2);
          padding: 12px 0;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .showcase-list li:first-child {
          border-top: none;
        }
        .showcase-list li svg {
          width: 16px;
          height: 16px;
          stroke: var(--accent);
          stroke-width: 2.4;
          fill: none;
          flex-shrink: 0;
        }
        .showcase-video {
          flex: 1;
        }
        .video-frame {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: #1a1a1a;
          aspect-ratio: 16/10;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }
        .video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.5);
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.14em;
          background:
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.02) 0 20px,
              transparent 20px 40px
            ),
            #1a1a1a;
        }
        .video-frame .frame-label {
          position: absolute;
          top: 16px;
          left: 16px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.08em;
        }
        .play-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(
            180deg,
            var(--accent-2),
            var(--accent-deep)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.4) inset,
            0 -1px 0 rgba(0, 0, 0, 0.2) inset,
            0 8px 24px rgba(255, 96, 61, 0.5);
        }
        .play-btn svg {
          width: 22px;
          height: 22px;
          fill: white;
          margin-left: 3px;
        }
        @media (max-width: 900px) {
          .showcase-flex {
            flex-direction: column;
          }
        }

        /* ============ FAQ ============ */
        .faq {
          padding: 100px 0 130px;
          border-top: 1px solid var(--border);
        }
        .faq-head {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 56px;
        }
        .faq-head .eyebrow {
          display: block;
          margin-bottom: 14px;
        }
        .faq-head h2 {
          font-size: clamp(1.8rem, 3.2vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.8px;
        }
        .faq-list {
          max-width: 760px;
          margin: 0 auto;
        }
        .faq-item {
          border-top: 1px solid var(--border);
        }
        .faq-item:last-child {
          border-bottom: 1px solid var(--border);
        }
        .faq-q {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 4px;
          font-family: inherit;
          font-size: 16.5px;
          font-weight: 600;
          color: var(--ink);
          transition: color 0.2s;
        }
        .faq-q:hover {
          color: var(--accent);
        }
        .faq-q .plus {
          font-family: var(--font-mono);
          font-size: 20px;
          color: var(--faint);
          transition:
            transform 0.25s ease,
            color 0.25s ease;
          flex-shrink: 0;
          margin-left: 20px;
        }
        .faq-item.open .plus {
          transform: rotate(45deg);
          color: var(--accent);
        }
        .faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
        }
        .faq-a-inner {
          padding: 0 4px 26px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
          max-width: 60ch;
        }

        /* ============ FOOTER ============ */
        .site-footer {
          position: relative;
          overflow: hidden;
          padding: 88px 0 0;
          background: linear-gradient(180deg, var(--bg-2) 0%, #f3f1ec 100%);
          border-top: 1px solid var(--border);
        }
        .footer-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse 700px 300px at 15% 0%,
              rgba(255, 96, 61, 0.08),
              transparent 70%
            ),
            radial-gradient(
              ellipse 500px 260px at 85% 10%,
              rgba(255, 96, 61, 0.06),
              transparent 70%
            );
        }
        .footer-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(0, 0, 0, 0.06) 1px,
            transparent 0
          );
          background-size: 16px 16px;
          mask-image: radial-gradient(
            ellipse 900px 400px at 50% 0%,
            black,
            transparent 75%
          );
          -webkit-mask-image: radial-gradient(
            ellipse 900px 400px at 50% 0%,
            black,
            transparent 75%
          );
          pointer-events: none;
        }
        .footer-inner {
          position: relative;
          z-index: 2;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 56px;
        }
        .footer-brand .logo {
          border-right: none;
          padding-right: 0;
          margin-right: 0;
          margin-bottom: 14px;
        }
        .footer-tagline {
          color: var(--muted);
          font-size: 14px;
          max-width: 30ch;
          line-height: 1.55;
        }
        .footer-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          padding: 6px 12px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 20px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--ink-2);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 2px 6px rgba(0, 0, 0, 0.04);
        }
        .footer-status .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00b67a;
          box-shadow: 0 0 6px rgba(0, 182, 122, 0.7);
          animation: dashPulse 2s ease-in-out infinite;
        }
        .footer-col h4 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--faint);
          margin-bottom: 16px;
          font-weight: 600;
          font-family: var(--font-mono);
        }
        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .footer-col a {
          font-size: 14px;
          color: var(--ink-2);
          position: relative;
          width: fit-content;
          display: inline-block;
          transition: color 0.2s ease;
        }
        .footer-col a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 1px;
          background: var(--accent);
          transition: width 0.25s ease;
        }
        .footer-col a:hover {
          color: var(--ink);
        }
        .footer-col a:hover::after {
          width: 100%;
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 0;
          border-top: 1px solid var(--border-2);
          flex-wrap: wrap;
          gap: 14px;
        }
        .foot-fine {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--faint);
          letter-spacing: 0.08em;
        }
        .footer-right {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .footer-built {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          padding: 5px 10px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 20px;
        }
        .footer-social {
          display: flex;
          gap: 8px;
        }
        .footer-social a {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px solid var(--border);
          color: var(--ink-2);
          transition:
            transform 0.25s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }
        .footer-social a:hover {
          transform: translateY(-3px) rotate(-4deg);
          border-color: var(--accent);
          color: var(--accent);
        }
        .footer-social svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.8;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px 24px;
          }
          .footer-brand {
            grid-column: span 2;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-brand {
            grid-column: span 1;
          }
        }

        /* Reveal on scroll */
        .reveal {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity 0.6s ease,
            transform 0.6s ease;
        }
        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 968px) {
          .nav-shell {
            padding: 8px;
          }
          .nav-links {
            display: none;
          }
          .logo {
            padding-right: 8px;
            margin-right: 0;
            border-right: none;
          }
          .hero h1 {
            font-size: 42px;
            letter-spacing: -1px;
          }
          .icon-s3,
          .icon-key {
            width: 52px;
            height: 52px;
          }
          .icon-s3 svg {
            width: 32px;
            height: 32px;
          }
          .icon-key svg {
            width: 26px;
            height: 26px;
          }
          .browser-body {
            grid-template-columns: 1fr;
          }
          .dash-side,
          .dash-right {
            display: none;
          }
          .browser-outer {
            padding: 8px;
          }
        }
        @media (max-width: 640px) {
          .hero {
            padding: 30px 16px 50px;
          }
          .hero h1 {
            font-size: 34px;
            letter-spacing: -0.8px;
          }
          .hero p.subtitle {
            font-size: 15px;
          }
          .hero-ctas {
            flex-direction: column;
            gap: 14px;
          }
          .stage {
            padding: 30px 0 60px;
          }
          .browser-topbar {
            padding: 10px 12px;
          }
          .browser-url {
            font-size: 10px;
            padding: 4px 10px;
          }
          .plan-section {
            padding: 90px 0 60px;
          }
          .plan-card {
            padding: 22px;
            min-height: 170px;
          }
          .card-storage .big-num {
            font-size: 64px;
          }
        }
      `}</style>
    </div>
  );
}

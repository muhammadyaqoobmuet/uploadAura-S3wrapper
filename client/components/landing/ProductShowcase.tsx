"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CALLOUTS = [
  {
    title: "Upload in seconds",
    body: "Drag files onto the dashboard or call the API — both land in the same place.",
  },
  {
    title: "One-click sharing",
    body: "Every file gets a permanent public URL the moment it lands in your account.",
  },
  {
    title: "Instant analytics",
    body: "Storage charts update in real time. No manual refresh, no stale numbers.",
  },
];

export function ProductShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--color-surface-2)" }}
      aria-labelledby="showcase-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div style={{ maxWidth: "540px" }}>
            <p
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--color-accent)" }}
            >
              Product
            </p>
            <h2
              id="showcase-heading"
              className="font-bold tracking-tight"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.03em",
                color: "var(--color-ink)",
                lineHeight: 1.15,
              }}
            >
              A dashboard that gets
              <br />
              <span
                style={{ color: "var(--color-ink-muted)", fontWeight: 500 }}
              >
                out of your way.
              </span>
            </h2>
          </div>
          <Link
            href="/register"
            className="btn-primary self-start lg:self-auto shrink-0"
          >
            Try it free
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        {/* ── Screenshot ── */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative"
        >
          {/* Outer frame */}
          <div
            style={{
              background: "var(--color-surface-3)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-2xl)",
              padding: "3px",
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.05), 0 20px 48px rgba(0,0,0,0.09)",
            }}
          >
            {/* Inner window chrome */}
            <div
              style={{
                background: "var(--color-surface-3)",
                borderRadius: "calc(var(--radius-2xl) - 3px)",
                overflow: "hidden",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-4"
                style={{
                  height: "38px",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span className="flex gap-1.5" aria-hidden="true">
                  {["#e2ddd6", "#e2ddd6", "#e2ddd6"].map((c, i) => (
                    <span
                      key={i}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: c,
                        display: "block",
                      }}
                    />
                  ))}
                </span>
                {/* Address bar */}
                <div className="flex-1 mx-3">
                  <div
                    className="flex items-center gap-1.5 rounded px-2.5 py-0.5 mx-auto"
                    style={{
                      maxWidth: "320px",
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--color-ink-faint)", fontFamily: "var(--font-mono)" }}
                    >
                      app.uploadaura.dev/dashboard
                    </span>
                  </div>
                </div>
              </div>

              {/* Screenshot image */}
              <div style={{ aspectRatio: "16/9", position: "relative" }}>
                <Image
                  src="/aa.png"
                  alt="UploadAura dashboard showing the file manager with upload, preview, and sharing controls"
                  fill
                  quality={95}
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>
            </div>
          </div>

          {/* Subtle ground shadow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-32px",
              left: "15%",
              right: "15%",
              height: "64px",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.07) 0%, transparent 70%)",
              filter: "blur(10px)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* ── Callout strip ── */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-px"
          style={{
            background: "var(--color-border)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
          }}
        >
          {CALLOUTS.map((c) => (
            <div
              key={c.title}
              className="flex flex-col gap-2 px-7 py-6"
              style={{ background: "var(--color-surface)" }}
            >
              <p
                className="text-[14px] font-semibold tracking-tight"
                style={{ color: "var(--color-ink)", letterSpacing: "-0.01em" }}
              >
                {c.title}
              </p>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {c.body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

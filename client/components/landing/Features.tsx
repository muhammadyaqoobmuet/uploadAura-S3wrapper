"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { HardDrive, Layers, Code2, BarChart2, Eye, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    title: "2 GB Free Storage",
    description:
      "Upload up to 2 GB across unlimited files. A generous free tier with no hidden limits or credit card required.",
    Icon: HardDrive,
  },
  {
    title: "Bulk Operations",
    description:
      "Select and download or delete multiple files at once. Manage your entire library at scale without tedious one-by-one actions.",
    Icon: Layers,
  },
  {
    title: "Developer API",
    description:
      "Generate API keys and integrate file uploads into any app in minutes. Clean REST endpoints, clear docs.",
    Icon: Code2,
  },
  {
    title: "Real-time Analytics",
    description:
      "Storage breakdowns and usage charts that stay in sync as your files change. Always know where you stand.",
    Icon: BarChart2,
  },
  {
    title: "Inline Previews",
    description:
      "Images, PDFs, and videos render directly inside the dashboard — no download needed to see what's inside.",
    Icon: Eye,
  },
  {
    title: "Instant Sharing",
    description:
      "Every file gets a permanent public URL. One click to copy, ready to share anywhere.",
    Icon: Share2,
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function Features() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="features"
      className="py-24 md:py-32"
      style={{ background: "var(--color-surface)" }}
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="mb-16 md:mb-20 max-w-2xl">
          <p
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--color-accent)" }}
          >
            Features
          </p>
          <h2
            id="features-heading"
            className="font-bold tracking-tight"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              lineHeight: 1.15,
            }}
          >
            Everything you need.
            <br />
            <span style={{ color: "var(--color-ink-muted)", fontWeight: 500 }}>
              Nothing you don&apos;t.
            </span>
          </h2>
          <p
            className="mt-4 text-[15px] leading-relaxed"
            style={{ color: "var(--color-ink-muted)", maxWidth: "48ch" }}
          >
            Built for developers who want to ship fast and stay in control —
            without wrestling with cloud infrastructure.
          </p>
        </div>

        {/* ── Feature grid ── */}
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{
            background: "var(--color-border)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.03)",
          }}
        >
          {FEATURES.map((feature, idx) => {
            const { Icon } = feature;
            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                className="group relative flex flex-col gap-5 p-7"
                style={{
                  background: "var(--color-surface)",
                  cursor: "default",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--color-surface-2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--color-surface)";
                }}
              >
                {/* Number */}
                <span
                  className="absolute top-5 right-5 text-[11px] font-medium"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-border-2)",
                    letterSpacing: "0.04em",
                  }}
                  aria-hidden="true"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]"
                  style={{
                    background: "var(--color-surface-3)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                  }}
                  aria-hidden="true"
                >
                  <Icon
                    size={16}
                    strokeWidth={1.75}
                    style={{ color: "var(--color-ink-2)" }}
                  />
                </span>

                {/* Copy */}
                <div className="flex flex-col gap-2">
                  <h3
                    className="text-[15px] font-semibold tracking-tight"
                    style={{ color: "var(--color-ink)", letterSpacing: "-0.01em" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-[13.5px] leading-relaxed"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

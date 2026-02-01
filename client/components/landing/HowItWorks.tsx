"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { UserPlus, UploadCloud, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  step: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    step: "01",
    title: "Create your account",
    description:
      "Register in seconds. You get 2 GB of free storage from day one — no credit card, no friction.",
    Icon: UserPlus,
  },
  {
    step: "02",
    title: "Upload your files",
    description:
      "Drag and drop from the browser dashboard, or pipe files straight through the REST API from your app.",
    Icon: UploadCloud,
  },
  {
    step: "03",
    title: "Share and manage",
    description:
      "Preview, organise, and share files via permanent public URLs. Full API access for power users.",
    Icon: Share2,
  },
] as const;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32"
      style={{ background: "var(--color-surface-2)" }}
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="mb-16 md:mb-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p
              className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--color-accent)" }}
            >
              How it works
            </p>
            <h2
              id="how-it-works-heading"
              className="font-bold tracking-tight"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.03em",
                color: "var(--color-ink)",
                lineHeight: 1.15,
              }}
            >
              Up and running
              <br />
              <span style={{ color: "var(--color-ink-muted)", fontWeight: 500 }}>
                in under five minutes.
              </span>
            </h2>
          </div>
          <p
            className="text-[14px] leading-relaxed sm:text-right"
            style={{ color: "var(--color-ink-muted)", maxWidth: "34ch" }}
          >
            Three steps. No configuration rabbit holes, no IAM headaches.
          </p>
        </div>

        {/* ── Steps ── */}
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {STEPS.map((s, idx) => {
            const { Icon } = s;
            const isLast = idx === STEPS.length - 1;
            return (
              <motion.div
                key={s.step}
                variants={stepVariants}
                className="relative flex flex-col"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "28px 28px 32px",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                {/* Step number + icon row */}
                <div className="flex items-center justify-between mb-8">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]"
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
                  <span
                    className="text-[13px] font-medium"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-border-2)",
                      letterSpacing: "0.04em",
                    }}
                    aria-label={`Step ${s.step}`}
                  >
                    {s.step}
                  </span>
                </div>

                {/* Content */}
                <h3
                  className="text-[16px] font-semibold tracking-tight mb-2.5"
                  style={{ color: "var(--color-ink)", letterSpacing: "-0.015em" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[13.5px] leading-relaxed"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  {s.description}
                </p>

                {/* Connector arrow — desktop only, not on last card */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="hidden md:flex absolute -right-[18px] top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      background: "var(--color-surface-3)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2 5h6M5.5 2.5L8 5l-2.5 2.5"
                        stroke="var(--color-ink-faint)"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

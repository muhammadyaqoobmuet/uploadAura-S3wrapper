"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, Upload, Zap } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const copyVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const STATS = [
  { value: "2 GB", label: "Free storage" },
  { value: "100 MB", label: "Per-file limit" },
  { value: "REST", label: "API-first" },
] as const;

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, 60],
  );

  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -32],
  );

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      aria-label="Hero"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Background image with parallax - ZOOMED IN ── */}
      <motion.div
        aria-hidden="true"
        className="absolute z-0"
        style={{ 
          y: bgY,
          top: "-15%",
          left: "-15%",
          right: "-15%",
          bottom: "-15%",
        }}
      >
        <Image
          src="/uploadAura.png"
          alt=""
          fill
          priority
          quality={95}
          className="object-cover object-center"
          sizes="130vw"
        />
      </motion.div>

      {/* ── Minimal overlay — only fade at bottom for section transition ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 70%, rgba(253,253,253,0.6) 88%, rgba(253,253,253,1) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-20 flex flex-col items-center text-center">
        {/* Top copy */}
        <motion.div
          variants={copyVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          className="flex flex-col items-center px-6 pt-32 pb-0"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants}>
            <span
              className="inline-flex items-center gap-1.5 mb-6 px-3 py-1 rounded-full text-[12px] font-medium tracking-wide"
              style={{
                background: "rgba(255,255,255,0.82)",
                border: "1px solid var(--color-border)",
                color: "var(--color-ink-muted)",
                backdropFilter: "blur(8px)",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <Zap
                size={11}
                strokeWidth={2.5}
                style={{ color: "var(--color-accent)" }}
              />
              Simple Cloud Storage API
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-bold leading-[1.04] tracking-tight"
            style={{
              fontSize: "clamp(2.75rem, 6.5vw, 5rem)",
              letterSpacing: "-0.035em",
              color: "var(--color-ink)",
              textShadow: "0 1px 2px rgba(255,255,255,0.9), 0 2px 8px rgba(255,255,255,0.7)",
            }}
          >
            Upload anything.
            <br />
            <span
              style={{
                color: "var(--color-ink-2)",
                fontWeight: 700,
              }}
            >
              Skip the infrastructure.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="mt-6 leading-relaxed"
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              color: "var(--color-ink-muted)",
              maxWidth: "52ch",
              fontWeight: 400,
              textShadow: "0 1px 3px rgba(255,255,255,0.8)",
            }}
          >
            Skip AWS S3 buckets, IAM policies, and endless configuration.
            UploadAura gives you an API key and a clean dashboard — ship your
            product in minutes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/register" className="btn-primary !px-5 !py-2.5 !text-[14px] !font-semibold">
              Start for free
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <a
              href="#how-it-works"
              className="btn-secondary !px-5 !py-2.5 !text-[14px] !font-medium"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>

        {/* ── Product screenshot ── */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          style={{ y: imgY }}
          className="relative w-full mt-16 px-4 sm:px-8 lg:px-16"
        >
          <div
            className="relative mx-auto"
            style={{ maxWidth: "1040px" }}
          >
            {/* Browser chrome mockup */}
            <div
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.06), 0 32px 64px rgba(0,0,0,0.1), 0 64px 96px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center gap-2 px-4"
                style={{
                  height: "36px",
                  background: "var(--color-surface-3)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span
                  className="flex gap-1.5 items-center"
                  aria-hidden="true"
                >
                  {["#d0d0cc", "#d0d0cc", "#d0d0cc"].map((c, i) => (
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
                <span
                  className="flex-1 mx-4"
                  style={{
                    height: "20px",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                  }}
                />
              </div>

              {/* Screenshot */}
              <div
                style={{
                  aspectRatio: "16/9",
                  position: "relative",
                  background: "var(--color-surface)",
                }}
              >
                <Image
                  src="/aa.png"
                  alt="UploadAura dashboard — file manager interface"
                  fill
                  quality={95}
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 1040px"
                />
              </div>
            </div>

            {/* Reflection/glow beneath screenshot */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "-40px",
                left: "10%",
                right: "10%",
                height: "80px",
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, transparent 70%)",
                filter: "blur(12px)",
                pointerEvents: "none",
              }}
            />
          </div>
        </motion.div>

        {/* ── Stats strip ── */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
          className="relative z-10 flex flex-wrap items-center justify-center gap-0 mt-16 mb-0 w-full"
          style={{ background: "var(--color-surface)" }}
        >
          <div
            className="w-full"
            style={{
              borderTop: "1px solid var(--color-border)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div className="mx-auto max-w-3xl flex items-stretch divide-x divide-[var(--color-border)]">
              {STATS.map((s) => (
                <div
                  key={s.value}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-6 px-4"
                >
                  <span
                    className="font-bold leading-none tracking-tight"
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--color-ink)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[12px] uppercase tracking-widest"
                    style={{ color: "var(--color-ink-faint)", letterSpacing: "0.08em" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  per: string;
  description: string;
  cta: string;
  ctaHref: string;
  features: string[];
  highlighted: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    per: "forever",
    description:
      "Everything you need to get started. No credit card required.",
    cta: "Get started free",
    ctaHref: "/register",
    features: [
      "2 GB storage included",
      "100 MB per-file limit",
      "REST API access",
      "API key management",
      "File previews",
      "Instant public URLs",
      "Basic analytics",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    per: "per month",
    description:
      "For serious projects that need room to grow and priority support.",
    cta: "Start Pro",
    ctaHref: "/register?plan=pro",
    features: [
      "50 GB storage included",
      "500 MB per-file limit",
      "Everything in Free",
      "Priority support",
      "Webhook notifications",
      "Custom domain CDN",
      "Advanced analytics",
    ],
    highlighted: true,
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function Pricing() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="pricing"
      className="py-24 md:py-32"
      style={{ background: "var(--color-surface)" }}
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="mb-14 md:mb-18 text-center">
          <p
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--color-accent)" }}
          >
            Pricing
          </p>
          <h2
            id="pricing-heading"
            className="font-bold tracking-tight"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              lineHeight: 1.15,
            }}
          >
            Simple, honest pricing.
          </h2>
          <p
            className="mt-4 text-[15px] leading-relaxed mx-auto"
            style={{ color: "var(--color-ink-muted)", maxWidth: "44ch" }}
          >
            Start free, upgrade when you need more. No surprise charges.
          </p>
        </div>

        {/* ── Pricing cards ── */}
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 mx-auto"
          style={{ maxWidth: "780px" }}
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className="relative flex flex-col"
              style={
                plan.highlighted
                  ? {
                      background: "var(--color-ink)",
                      border: "1px solid var(--color-ink-2)",
                      borderRadius: "var(--radius-xl)",
                      padding: "32px",
                      boxShadow:
                        "0 4px 8px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.5)",
                    }
                  : {
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-xl)",
                      padding: "32px",
                      boxShadow:
                        "0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
                    }
              }
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] rounded-full"
                  style={{
                    background: "var(--color-accent)",
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(184,115,51,0.35)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Most popular
                </span>
              )}

              {/* Plan name */}
              <p
                className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-5"
                style={{
                  color: plan.highlighted
                    ? "rgba(255,255,255,0.5)"
                    : "var(--color-ink-faint)",
                  letterSpacing: "0.1em",
                }}
              >
                {plan.name}
              </p>

              {/* Price */}
              <div className="flex items-end gap-2 mb-2">
                <span
                  className="font-bold leading-none"
                  style={{
                    fontSize: "2.75rem",
                    letterSpacing: "-0.04em",
                    color: plan.highlighted ? "#fff" : "var(--color-ink)",
                  }}
                >
                  {plan.price}
                </span>
                <span
                  className="mb-1 text-[13px]"
                  style={{
                    color: plan.highlighted
                      ? "rgba(255,255,255,0.4)"
                      : "var(--color-ink-faint)",
                  }}
                >
                  / {plan.per}
                </span>
              </div>

              <p
                className="text-[13.5px] leading-relaxed mb-7"
                style={{
                  color: plan.highlighted
                    ? "rgba(255,255,255,0.55)"
                    : "var(--color-ink-muted)",
                }}
              >
                {plan.description}
              </p>

              {/* Divider */}
              <div
                className="mb-6"
                style={{
                  height: "1px",
                  background: plan.highlighted
                    ? "rgba(255,255,255,0.1)"
                    : "var(--color-border)",
                }}
              />

              {/* Feature list */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2.5 text-[13.5px]"
                    style={{
                      color: plan.highlighted
                        ? "rgba(255,255,255,0.75)"
                        : "var(--color-ink-muted)",
                    }}
                  >
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: plan.highlighted
                          ? "rgba(255,255,255,0.1)"
                          : "var(--color-surface-3)",
                        border: plan.highlighted
                          ? "1px solid rgba(255,255,255,0.15)"
                          : "1px solid var(--color-border)",
                      }}
                      aria-hidden="true"
                    >
                      <Check
                        size={9}
                        strokeWidth={2.5}
                        style={{
                          color: plan.highlighted
                            ? "rgba(255,255,255,0.7)"
                            : "var(--color-ink-muted)",
                        }}
                      />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={plan.highlighted ? "btn-secondary" : "btn-primary"}
                style={{ textAlign: "center", justifyContent: "center" }}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Fine print */}
        <p
          className="mt-10 text-center text-[12.5px]"
          style={{ color: "var(--color-ink-faint)" }}
        >
          All plans include free SSL, global CDN, and uptime SLA.
          <br />
          Cancel or downgrade at any time — no lock-in.
        </p>
      </div>
    </section>
  );
}

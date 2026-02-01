"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export function Navbar() {
  const { isLoggedIn, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest: number) => {
      setScrolled(latest > 12);
    });
    return unsubscribe;
  }, [scrollY]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="sticky top-0 z-40"
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          background: scrolled
            ? "rgba(253,253,253,0.9)"
            : "rgba(253,253,253,0.7)",
          borderBottom: scrolled
            ? "1px solid var(--color-border)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 1px 0 rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)"
            : "none",
          transition:
            "background 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
        }}
      >
        <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
            aria-label="UploadAura home"
          >
            <span
              className="relative flex h-[20px] w-[20px] shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <span
                className="absolute inset-0 rounded-[5px] transition-opacity group-hover:opacity-25"
                style={{ background: "var(--color-accent)", opacity: 0.14 }}
              />
              <span
                className="h-[8px] w-[8px] rounded-full transition-transform group-hover:scale-110"
                style={{ background: "var(--color-accent)" }}
              />
            </span>
            <span
              className="text-[13.5px] font-medium tracking-tight"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-ink)",
                letterSpacing: "-0.01em",
              }}
            >
              UploadAura
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-0"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 text-[13px] font-medium rounded-[var(--radius-md)] transition-all"
                style={{ color: "var(--color-ink-muted)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--color-ink)";
                  el.style.background = "var(--color-surface-2)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--color-ink-muted)";
                  el.style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isLoading ? (
              <div
                className="h-8 w-[148px] rounded-[var(--radius-md)] animate-pulse"
                style={{ background: "var(--color-surface-3)" }}
                aria-hidden="true"
              />
            ) : isLoggedIn ? (
              <Link
                href="/dashboard"
                className="btn-primary !py-[7px] !px-4 !text-[13px]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-ghost !py-[7px] !px-4 !text-[13px]"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary !py-[7px] !px-4 !text-[13px]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-[var(--radius-md)] transition-colors"
            style={{ color: "var(--color-ink-muted)" }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "var(--color-surface-2)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "transparent")
            }
          >
            {menuOpen ? (
              <X size={17} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu size={17} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </motion.header>

      {/* ── Mobile nav panel ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-label="Mobile navigation"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="md:hidden fixed inset-x-0 top-[58px] z-[39]"
            style={{
              background: "rgba(253,253,253,0.97)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderBottom: "1px solid var(--color-border)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-0.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-[14px] font-medium rounded-[var(--radius-md)] transition-colors"
                  style={{ color: "var(--color-ink-muted)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--color-ink)";
                    (e.currentTarget as HTMLElement).style.background = "var(--color-surface-2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--color-ink-muted)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {link.label}
                </a>
              ))}

              <div
                className="mt-3 pt-3 flex flex-col gap-2"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                {isLoading ? (
                  <div
                    className="h-10 rounded-[var(--radius-md)] animate-pulse"
                    style={{ background: "var(--color-surface-3)" }}
                    aria-hidden="true"
                  />
                ) : isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="btn-primary w-full justify-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="btn-secondary w-full justify-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className="btn-primary w-full justify-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      Get started free
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

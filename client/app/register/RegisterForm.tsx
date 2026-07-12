"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError, registerUser } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Pre-computed confetti (avoids Math.random in render) ────────────────────

const CONFETTI_PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const startX = 15 + ((i * 4.5) % 65);
  const spread = ((i % 3) - 1) * (10 + ((i * 3) % 25));
  return {
    delay: i * 0.08,
    duration: 1.2 + (i % 7) * 0.09,
    startX,
    endX: startX + spread,
    rotation: ((i * 47) % 720) - 360,
    color: ["#FF603D", "#0c0c0b", "#27ae60", "#e67e22"][i % 4],
    width: 8 + (i % 6),
    height: 8 + ((i + 3) % 6),
    isCircle: i % 2 === 0,
  };
});

// ─── Stagger variants ─────────────────────────────────────────────────────────

const panelVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

// ─── Logo mark ────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <span className="relative flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1a1a1a,#0a0a0a)] shadow-[0_1px_4px_rgba(0,0,0,0.22),inset_0_0_0_1px_rgba(255,255,255,0.07)]">
      <span className="absolute size-[18px] rounded-full border-[1.5px] border-[#FF603D] shadow-[0_0_6px_rgba(255,96,61,0.45)]" />
      <span className="absolute size-[5px] rounded-full bg-[#FF603D] shadow-[0_0_5px_rgba(255,96,61,0.85)]" />
    </span>
  );
}

// ─── Password field ──────────────────────────────────────────────────────────

type PasswordFieldProps = {
  label: string;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

function PasswordField({
  label,
  error,
  id,
  ...inputProps
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-[13px] font-medium text-[var(--color-ink-2)] select-none"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={fieldId}
          type={show ? "text" : "password"}
          className={cn("input-base !pr-9", error && "input-error")}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          aria-invalid={!!error}
          {...inputProps}
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 text-[var(--color-ink-faint)] hover:text-[var(--color-ink-muted)] transition-colors duration-100"
        >
          {show ? (
            <EyeOff size={15} aria-hidden="true" />
          ) : (
            <Eye size={15} aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p
          id={`${fieldId}-error`}
          role="alert"
          className="text-[12px] text-[var(--color-error)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Branded visual panel ────────────────────────────────────────────────────

function AuraVisualPanel() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="auth-visual-panel reg-visual" aria-hidden="true">
      <div className="aura-glow" />
      <div className="aura-ring aura-ring-1" />
      <div className="aura-ring aura-ring-2" />

      {/* Floating code card */}
      <motion.div
        className="reg-code-card"
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, -14, 0], rotate: [0, 1.2, 0] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="reg-code-dots">
          <span /><span /><span />
        </div>
        <pre className="reg-code-text">
          <code>
            <span className="c-com">// one key, one upload</span>
            {"\n"}
            <span className="c-kw">const</span> aura ={" "}
            <span className="c-kw">new</span> UploadAura({"\n"}
            {"  "}apiKey: <span className="c-str">"sk_live_…"</span>,{"\n"}
            );{"\n\n"}
            <span className="c-kw">await</span> aura.
            <span className="c-fn">upload</span>(<span className="c-str">"./cat.png"</span>);
          </code>
        </pre>
      </motion.div>

      {/* Tagline */}
      <div className="auth-visual-bottom reg-visual-bottom">
        <p className="auth-visual-tagline">
          Start building.
          <br />
          Ship in minutes.
        </p>
        <div className="auth-visual-features reg-features">
          <span className="auth-visual-feature">✦ 2 GB free forever</span>
          <span className="auth-visual-feature">✦ No card needed</span>
          <span className="auth-visual-feature">✦ Instant API key</span>
        </div>
      </div>

      <style jsx>{`
        .reg-visual {
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }
        .reg-code-card {
          position: relative;
          z-index: 2;
          width: min(380px, 78%);
          border-radius: 18px;
          padding: 18px 20px;
          background: rgba(20, 20, 22, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .reg-code-dots {
          display: flex;
          gap: 7px;
          margin-bottom: 14px;
        }
        .reg-code-dots span {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
        }
        .reg-code-dots span:first-child {
          background: #ff5f56;
        }
        .reg-code-dots span:nth-child(2) {
          background: #ffbd2e;
        }
        .reg-code-dots span:nth-child(3) {
          background: #27c93f;
        }
        .reg-code-text {
          margin: 0;
          font-family: var(--font-ibm-plex-mono), monospace;
          font-size: 13px;
          line-height: 1.7;
          color: #e5e3df;
          white-space: pre-wrap;
        }
        .c-com {
          color: #6b7280;
          font-style: italic;
        }
        .c-kw {
          color: #ff7a59;
        }
        .c-str {
          color: #f0a36b;
        }
        .c-fn {
          color: #7dd3fc;
        }
        .reg-visual-bottom {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 0 40px 44px;
        }
        .reg-features {
          flex-wrap: wrap;
          gap: 8px 16px;
        }
      `}</style>
    </div>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessView({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean | null;
}) {
  return (
    <div className="auth-split">
      <div
        className="auth-form-panel"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <header className="auth-header">
          <span className="auth-logo">
            <LogoMark /> UploadAura
          </span>
        </header>

        {!shouldReduceMotion && (
          <>
            {CONFETTI_PARTICLES.map((p, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${p.startX}vw`,
                  y: "-10vh",
                  rotate: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: `${p.endX}vw`,
                  y: "110vh",
                  rotate: p.rotation,
                  opacity: 0,
                  scale: 0.4,
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
                }}
                className="absolute pointer-events-none"
                style={{
                  width: p.width,
                  height: p.height,
                  backgroundColor: p.color,
                  borderRadius: p.isCircle ? "50%" : "2px",
                }}
                aria-hidden="true"
              />
            ))}
          </>
        )}

        <motion.div
          className="auth-body"
          initial={
            shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 16 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.1 }}
        >
          <div className="auth-form-content" style={{ textAlign: "center" }}>
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success-light)] relative"
              style={{ position: "relative" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.4, times: [0, 0.6, 1] }}
              >
                <Check
                  size={24}
                  className="text-[var(--color-success)]"
                  aria-hidden="true"
                />
              </motion.div>
              {!shouldReduceMotion && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "2px solid var(--color-success)",
                  }}
                />
              )}
            </motion.div>

            <motion.h2
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="auth-heading"
              style={{ textAlign: "center" }}
            >
              Welcome aboard! 🎉
            </motion.h2>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="auth-sub"
              style={{ textAlign: "center", marginBottom: 0 }}
            >
              Your account is ready. Taking you to sign in…
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-5 flex items-center justify-center gap-1.5"
              aria-hidden="true"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                />
              ))}
            </motion.div>
          </div>
        </motion.div>

        <footer className="auth-footer">
          <span>© 2026 UploadAura</span>
        </footer>
      </div>

      <AuraVisualPanel />
    </div>
  );
}

// ─── Register form ────────────────────────────────────────────────────────────

export function RegisterForm() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function validate(): { name?: string; email?: string; password?: string } {
    const errs: { name?: string; email?: string; password?: string } = {};
    if (!name.trim()) {
      errs.name = "Name is required.";
    } else if (name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 5) {
      errs.password = "Password must be at least 5 characters.";
    }
    return errs;
  }

  function focusFirstError(errs: {
    name?: string;
    email?: string;
    password?: string;
  }) {
    const order = ["name", "email", "password"] as const;
    for (const key of order) {
      if (errs[key]) {
        (document.getElementById(key) as HTMLInputElement | null)?.focus();
        break;
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      focusFirstError(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({ name: name.trim(), email, password });
      if (res.sucess) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1800);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errorCode === "ACCESS_UNAUTHORIZED") {
          setGeneralError("An account with this email already exists.");
        } else if (err.errorCode === "VALIDATION_ERROR" && err.errors?.length) {
          const fe: { name?: string; email?: string; password?: string } = {};
          for (const e of err.errors) {
            if (e.feild === "name") fe.name = e.message;
            if (e.feild === "email") fe.email = e.message;
            if (e.feild === "password") fe.password = e.message;
          }
          setFieldErrors(fe);
          focusFirstError(fe);
        } else {
          setGeneralError(
            err.message || "Something went wrong. Please try again.",
          );
        }
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return <SuccessView shouldReduceMotion={shouldReduceMotion} />;
  }

  return (
    <div className="auth-split">
      {/* ─── Left: form panel ──────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        <header className="auth-header">
          <Link href="/" className="auth-logo">
            <LogoMark />
            Upload<span style={{ color: "var(--color-accent)" }}>Aura</span>
          </Link>
          <Link href="/login" className="auth-nav-link">
            Sign in
          </Link>
        </header>

        <motion.div
          className="auth-body"
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={shouldReduceMotion ? {} : panelVariants}
        >
          <div className="auth-form-content">
            <motion.h1
              variants={shouldReduceMotion ? {} : itemVariants}
              className="auth-heading"
            >
              Create your account
            </motion.h1>

            <motion.p
              variants={shouldReduceMotion ? {} : itemVariants}
              className="auth-sub"
            >
              2 GB free. No card needed.
            </motion.p>

            {generalError && (
              <motion.div
                role="alert"
                aria-live="polite"
                initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-5 px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-error-light)] border border-[rgba(192,57,43,0.18)] text-[13px] text-[var(--color-error)] leading-snug"
              >
                {generalError}
              </motion.div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
                <Input
                  label="Name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={fieldErrors.name}
                />
              </motion.div>

              <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                />
              </motion.div>

              <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
                <PasswordField
                  label="Password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                />
              </motion.div>

              <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
                <motion.div
                  whileTap={shouldReduceMotion ? {} : { scale: 0.985 }}
                >
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    loading={loading}
                    className="w-full"
                    rightIcon={!loading ? <ArrowRight size={16} /> : undefined}
                  >
                    Create account
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            <motion.p
              variants={shouldReduceMotion ? {} : itemVariants}
              className="mt-6 text-center text-[13px] text-[var(--color-ink-muted)]"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[var(--color-ink)] underline-offset-2 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </motion.p>
          </div>
        </motion.div>

        <footer className="auth-footer">
          <span>© 2026 UploadAura</span>
          <span aria-hidden="true">·</span>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </footer>
      </div>

      {/* ─── Right: branded visual panel ───────────────────────────────────── */}
      <AuraVisualPanel />
    </div>
  );
}

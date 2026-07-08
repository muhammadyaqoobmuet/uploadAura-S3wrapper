"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
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
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

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

// ─── Field errors ─────────────────────────────────────────────────────────────

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

// ─── Photo visual panel ──────────────────────────────────────────────────────

function AuraVisualPanel() {
  return (
    <div className="auth-visual-panel" aria-hidden="true">
      {/* Full-bleed photo */}
      <Image
        src="/uploadAuraLogin.png"
        alt=""
        fill
        priority
        className="object-cover object-center auth-panel-image"
        sizes="(min-width: 1024px) 50vw, 0px"
      />

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.18) 45%, transparent 75%)",
        }}
      />

      {/* Tagline — register variant */}
      <div className="auth-visual-bottom">
        <p className="auth-visual-tagline">
          Start building.
          <br />
          Ship in minutes.
        </p>
        <div className="auth-visual-features">
          <span className="auth-visual-feature">✦ 2 GB free forever</span>
          <span className="auth-visual-feature">✦ No card needed</span>
          <span className="auth-visual-feature">✦ Instant API key</span>
        </div>
      </div>
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
          <span className="auth-logo">UploadAura</span>
        </header>

        {/* Confetti */}
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
                  ease: [0.25, 0.46, 0.45, 0.94],
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
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
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

  function focusFirstError(errs: FieldErrors) {
    const order: (keyof FieldErrors)[] = ["name", "email", "password"];
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
          const fe: FieldErrors = {};
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
        {/* Header */}
        <header className="auth-header">
          <Link href="/" className="auth-logo">
            {/* Logo mark */}
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1a1a1a, #0a0a0a)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow:
                  "0 1px 4px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.07) inset",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 18,
                  height: 18,
                  border: "1.5px solid #FF603D",
                  borderRadius: "50%",
                  boxShadow: "0 0 6px rgba(255,96,61,0.45)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 5,
                  height: 5,
                  background: "#FF603D",
                  borderRadius: "50%",
                  boxShadow: "0 0 5px rgba(255,96,61,0.85)",
                }}
              />
            </div>
            Upload
            <span style={{ color: "var(--color-accent)" }}>Aura</span>
          </Link>
          <Link href="/login" className="auth-nav-link">
            Sign in
          </Link>
        </header>

        {/* Form body — staggered entrance */}
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

            {/* General error banner */}
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

        {/* Footer */}
        <footer className="auth-footer">
          <span>© 2026 UploadAura</span>
          <span aria-hidden="true">·</span>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </footer>
      </div>

      {/* ─── Right: photo panel ───────────────────────────────────────────── */}
      <AuraVisualPanel />
    </div>
  );
}

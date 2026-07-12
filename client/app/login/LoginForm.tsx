"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError, loginUser } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

// ─── Stagger variants ─────────────────────────────────────────────────────────

const panelVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
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
  email?: string;
  password?: string;
}

// ─── Logo mark ────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div className="relative flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1a1a1a,#0a0a0a)] shadow-[0_1px_4px_rgba(0,0,0,0.22),inset_0_0_0_1px_rgba(255,255,255,0.07)]">
      <div className="absolute size-[18px] rounded-full border-[1.5px] border-[#FF603D] shadow-[0_0_6px_rgba(255,96,61,0.45)]" />
      <div className="absolute size-[5px] rounded-full bg-[#FF603D] shadow-[0_0_5px_rgba(255,96,61,0.85)]" />
    </div>
  );
}

// ─── Photo visual panel ──────────────────────────────────────────────────────

function AuraVisualPanel() {
  return (
    <div className="auth-visual-panel" aria-hidden="true">
      <Image
        src="/uploadAuraLogin.png"
        alt=""
        fill
        priority
        className="object-cover  auth-panel overflow-hidden overflow-x-hidden"
        sizes="(min-width: 1024px) 50vw, 0px"
      />
      {/* Bottom gradient for text legibility */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.18)_45%,transparent_75%)]" />
      <div className="auth-visual-bottom">
        <p className="auth-visual-tagline">
          Your files,
          <br />
          everywhere.
        </p>
        <div className="auth-visual-features">
          <span className="auth-visual-feature">✦ AWS S3 backed</span>
          <span className="auth-visual-feature">✦ 2 GB free</span>
          <span className="auth-visual-feature">✦ API-first</span>
        </div>
      </div>
    </div>
  );
}

// ─── Login form ──────────────────────────────────────────────────────────────

export function LoginForm() {
  const auth = useAuth();
  const toast = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!password) {
      errs.password = "Password is required.";
    }
    return errs;
  }

  function focusFirstError(errs: FieldErrors) {
    const order: (keyof FieldErrors)[] = ["email", "password"];
    for (const key of order) {
      if (errs[key]) {
        (document.getElementById(key) as HTMLInputElement | null)?.focus();
        break;
      }
    }
  }

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      focusFirstError(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      auth.login(res.token, res.expiresAt, res.user);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errorCode === "VALIDATION_ERROR" && err.errors?.length) {
          const fe: FieldErrors = {};
          for (const e of err.errors) {
            if (e.feild === "email") fe.email = e.message;
            if (e.feild === "password") fe.password = e.message;
          }
          setFieldErrors(fe);
          focusFirstError(fe);
        } else {
          toast.error(
            "Invalid email or password",
            err.message || "Please check your credentials and try again."
          );
        }
      } else {
        toast.error("Something went wrong", "Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-split overflow-hidden px-6  ">
      {/* ─── Left: form panel ──────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        {/* Header */}
        <header className="auth-header">
          <Link href="/" className="auth-logo">
            <LogoMark />
            Upload<span className="text-(--color-accent)">Aura</span>
          </Link>
          <Link href="/register" className="auth-nav-link">
            Sign up
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
              Welcome back
            </motion.h1>

            <motion.p
              variants={shouldReduceMotion ? {} : itemVariants}
              className="auth-sub"
            >
              Sign in to continue uploading.
            </motion.p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
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
                  autoComplete="current-password"
                  placeholder="Your password"
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
                    Sign in
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            <motion.p
              variants={shouldReduceMotion ? {} : itemVariants}
              className="mt-6 text-center text-[13px] text-[var(--color-ink-muted)]"
            >
              No account?{" "}
              <Link
                href="/register"
                className="font-medium text-[var(--color-ink)] underline-offset-2 hover:underline transition-colors"
              >
                Create one
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

"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError, loginUser } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

// ─── Password field ──────────────────────────────────────────────────────────
// Custom implementation so the show/hide toggle button is interactive
// (Input's rightIcon slot uses pointer-events-none).

type PasswordFieldProps = {
  label: string;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

function PasswordField({ label, error, id, ...inputProps }: PasswordFieldProps) {
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
          className="absolute right-3 text-[var(--color-ink-faint)] hover:text-[var(--color-ink-muted)] transition-colors"
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

// ─── Field error state ───────────────────────────────────────────────────────

interface FieldErrors {
  email?: string;
  password?: string;
}

// ─── Login form ──────────────────────────────────────────────────────────────

export function LoginForm() {
  const auth = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
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
    // Input component auto-derives id from label ("Email" → "email")
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
          setGeneralError(err.message || "Invalid email or password.");
        }
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-12 bg-[var(--color-surface)]">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="card w-full max-w-[400px] p-8"
      >
        {/* Logo + heading */}
        <div className="mb-6 text-center">
          <span className="font-mono text-[11px] font-medium tracking-[0.13em] uppercase text-[var(--color-ink-muted)]">
            UploadAura
          </span>
          <h1 className="mt-2 text-[22px] font-semibold tracking-tight text-[var(--color-ink)]">
            Welcome back
          </h1>
        </div>

        {/* General error banner */}
        {generalError && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-error-light)] border border-[rgba(192,57,43,0.18)] text-[13px] text-[var(--color-error)] leading-snug"
          >
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="you@example.com\u2026"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          <PasswordField
            label="Password"
            id="password"
            autoComplete="current-password"
            placeholder="Your password\u2026"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-[13px] text-[var(--color-ink-muted)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--color-ink)] font-medium underline-offset-2 hover:underline hover:text-[var(--color-accent)] transition-colors"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

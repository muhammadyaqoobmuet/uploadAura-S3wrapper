"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-[var(--color-ink-2)] select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 text-[var(--color-ink-faint)]"
          >
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "input-base",
            !!leftIcon && "!pl-9",
            !!rightIcon && "!pr-9",
            !!error && "input-error",
            className,
          )}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          aria-invalid={!!error}
          {...props}
        />
        {rightIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 text-[var(--color-ink-faint)]"
          >
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-[12px] text-[var(--color-error)] flex items-center gap-1"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p
          id={`${inputId}-hint`}
          className="text-[12px] text-[var(--color-ink-muted)]"
        >
          {hint}
        </p>
      )}
    </div>
  );
}

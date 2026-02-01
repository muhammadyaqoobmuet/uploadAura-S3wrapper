"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} aria-hidden="true" />,
  error:   <XCircle size={16} aria-hidden="true" />,
  warning: <AlertTriangle size={16} aria-hidden="true" />,
  info:    <Info size={16} aria-hidden="true" />,
};

const COLORS: Record<ToastType, { icon: string; border: string; bg: string }> = {
  success: { icon: "text-[var(--color-success)]",  border: "border-[var(--color-success)]/20", bg: "bg-[var(--color-success-light)]" },
  error:   { icon: "text-[var(--color-error)]",    border: "border-[var(--color-error)]/20",   bg: "bg-[var(--color-error-light)]"   },
  warning: { icon: "text-[var(--color-warning)]",  border: "border-[var(--color-warning)]/20", bg: "bg-[var(--color-warning-light)]" },
  info:    { icon: "text-[var(--color-ink-muted)]", border: "border-[var(--color-border)]",    bg: "bg-[var(--color-white)]"         },
};

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = String(++toastCounter);
      setToasts((prev) => [...prev.slice(-4), { id, type, title, message }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const ctx: ToastContextValue = {
    toast,
    success: (t, m) => toast("success", t, m),
    error:   (t, m) => toast("error", t, m),
    warning: (t, m) => toast("warning", t, m),
    info:    (t, m) => toast("info", t, m),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((t) => {
            const c = COLORS[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 48, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 48, scale: 0.95 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto flex items-start gap-3 rounded-[var(--radius-lg)] border px-4 py-3 shadow-lg min-w-[260px] max-w-[340px] ${c.bg} ${c.border}`}
              >
                <span className={`mt-0.5 shrink-0 ${c.icon}`}>{ICONS[t.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--color-ink)] leading-snug">
                    {t.title}
                  </p>
                  {t.message && (
                    <p className="text-[12px] text-[var(--color-ink-muted)] mt-0.5 leading-snug">
                      {t.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 mt-0.5 text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

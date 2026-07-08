"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Menu, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

// The sidebar color. Used as the shell background so the
// content panel's rounded-left corners reveal this colour,
// creating the "floating panel on dark base" effect.
const SIDEBAR_BG = "#0e0d0b";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Easter egg: Ctrl/Cmd + K + K to show a fun message
  useEffect(() => {
    if (!isLoggedIn) return;

    let cmdPressed = false;
    let kCount = 0;
    let timeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        cmdPressed = true;
        kCount++;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          kCount = 0;
        }, 1000);

        if (kCount === 2) {
          const messages = [
            "You found the secret! 🎉",
            "Konami code not required here 🎮",
            "Curious, aren't you? We like that ✨",
            "This feature doesn't exist... or does it? 🤔",
            "Achievement unlocked: Button masher 🏆",
          ];
          const randomMessage =
            messages[Math.floor(Math.random() * messages.length)];

          toast.success(randomMessage, "Keep exploring!");
          setShowEasterEgg(true);
          setTimeout(() => setShowEasterEgg(false), 3000);
          kCount = 0;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") {
        cmdPressed = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearTimeout(timeout);
    };
  }, [isLoggedIn, toast]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: SIDEBAR_BG }}
      >
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[var(--color-accent)]" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: SIDEBAR_BG }}
    >
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar — sits in the dark shell, no border needed */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Easter egg sparkles */}
      <AnimatePresence>
        {showEasterEgg && (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const distance = 120 + Math.random() * 60;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;

              return (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: "50vw",
                    y: "50vh",
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: `calc(50vw + ${x}px)`,
                    y: `calc(50vh + ${y}px)`,
                    rotate: [0, 180],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                  className="fixed pointer-events-none z-50"
                  style={{ color: "var(--color-accent)" }}
                  aria-hidden="true"
                >
                  <Sparkles size={20} />
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/*
        Main content panel.
        rounded-tl + rounded-bl create the "floating on sidebar" illusion:
        the dark shell shows through the rounded corners.
      */}
      <div
        className="flex flex-1 flex-col overflow-hidden rounded-tl-[20px] rounded-bl-[20px] bg-[var(--color-surface)]"
        style={{
          boxShadow: "-4px 0 24px rgba(0,0,0,0.18)",
        }}
      >
        {/* Mobile top bar */}
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-white)] px-4 lg:hidden rounded-tl-[20px]">
          <button
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
            className="btn-ghost !p-1.5"
            style={{ color: "var(--color-ink-muted)" }}
          >
            <Menu size={18} aria-hidden="true" />
          </button>
          <span
            className="font-mono text-[14px] font-semibold tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            Upload<span style={{ color: "var(--color-accent)" }}>Aura</span>
          </span>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

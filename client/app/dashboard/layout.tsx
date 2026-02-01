"use client";

import React, { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// The sidebar color. Used as the shell background so the
// content panel's rounded-left corners reveal this colour,
// creating the "floating panel on dark base" effect.
const SIDEBAR_BG = "#1B1A17";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

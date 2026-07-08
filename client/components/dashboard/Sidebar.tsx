"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, BarChart2, Key, LogOut, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { StorageBar } from "./StorageBar";
import { cn } from "@/lib/utils";

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV = [
  { label: "Files", href: "/dashboard", Icon: LayoutGrid, exact: true },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    Icon: BarChart2,
    exact: false,
  },
  { label: "API Keys", href: "/dashboard/api-keys", Icon: Key, exact: false },
] as const;

// ─── Framer Motion variants ───────────────────────────────────────────────────

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.18 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-[220px] flex-col overflow-hidden",
        "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "lg:relative lg:translate-x-0 lg:z-auto lg:h-full",
        "bg-black  ",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
      aria-label="Main navigation"
    >
      {/* All content sits above overlays */}
      <div className="relative z-10 flex h-full flex-col">
        {/* ── Logo ─────────────────────────────────────── */}
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/6 px-4">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-2.5"
          >
            <div className="relative flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1a1a1a,#0a0a0a)] shadow-[0_1px_4px_rgba(0,0,0,0.22),inset_0_0_0_1px_rgba(255,255,255,0.07)]">
              <div className="absolute size-[18px] rounded-full border-[1.5px] border-[#FF603D] shadow-[0_0_6px_rgba(255,96,61,0.45)]" />
              <div className="absolute size-[5px] rounded-full bg-[#FF603D] shadow-[0_0_5px_rgba(255,96,61,0.85)]" />
            </div>
            <span className="font-mono text-[13.5px] font-semibold tracking-tight text-white">
              Upload<span className="">Aura</span>
            </span>
          </Link>

          {/* Mobile close */}
          <button
            aria-label="Close navigation"
            onClick={onMobileClose}
            className="lg:hidden flex size-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.07] hover:text-white/75"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {/* ── Navigation ───────────────────────────────── */}
        <nav
          className="flex-1 overflow-y-auto px-2.5 py-4"
          aria-label="Sidebar "
        >
          <motion.ul
            role="list"
            className="flex flex-col gap-0.5"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            {NAV.map(({ label, href, Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <motion.li key={href} variants={itemVariants}>
                  <Link
                    href={href}
                    onClick={onMobileClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-150",
                      active
                        ? "text-white"
                        : "text-white/40 hover:text-white/70",
                    )}
                  >
                    {/* Animated active background */}
                    {active && (
                      <motion.div
                        layoutId="sidebar-active-bg"
                        className="sidebar-active-bg absolute inset-0 rounded-lg bg-white"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 38,
                        }}
                      />
                    )}

                    {/* Hover background for inactive */}
                    {!active && (
                      <span className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 bg-white/[0.05]" />
                    )}

                    {/* Left accent bar for active */}
                    {active && (
                      <motion.div
                        layoutId="sidebar-accent-bar"
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[white] shadow-[0_0_8px_rgba(255,96,61,0.7)]"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 38,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <motion.span
                      className={cn(
                        "relative z-10 shrink-0 transition-colors duration-150",
                        active
                          ? "text-(white)"
                          : "text-white/40 group-hover:text-white/65",
                      )}
                      whileHover={{ scale: 1.12 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 18,
                      }}
                    >
                      <Icon size={15} aria-hidden="true" />
                    </motion.span>

                    {/* Label */}
                    <span className="relative z-10">{label}</span>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* ── Bottom ───────────────────────────────────── */}
        <div className="shrink-0 space-y-3 border-t border-white/[0.06] px-3 pb-4 pt-3">
          <StorageBar dark />

          {/* User card */}
          <motion.div
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.38,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* User info row */}
            <div className="flex items-center gap-2.5 mb-2.5">
              {/* Avatar — larger, rounded square */}
              <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[rgba(255,96,61,0.22)] ring-1 ring-white/[0.12]">
                {user?.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={user.name ?? "Profile picture"}
                    fill
                    sizes="36px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-[13px] font-bold leading-none text-(--color-accent)">
                    {initials}
                  </span>
                )}
              </div>

              {/* Name + email */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-tight text-white/90">
                  {user?.name ?? "—"}
                </p>
                <p className="truncate text-[11px] leading-tight text-white/42 mt-0.5">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>

            {/* Sign out — full-width row */}
            <motion.button
              aria-label="Sign out"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-white/38 transition-colors hover:bg-white/[0.06] hover:text-white/68"
              whileHover={{ x: 1 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={12} aria-hidden="true" />
              Sign out
            </motion.button>
          </motion.div>
        </div>
      </div>
    </aside>
  );
}

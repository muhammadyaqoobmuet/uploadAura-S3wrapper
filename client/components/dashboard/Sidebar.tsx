"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, BarChart2, Key, LogOut, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { StorageBar } from "./StorageBar";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const NAV: NavItem[] = [
  {
    label: "Files",
    href: "/dashboard",
    icon: <LayoutGrid size={15} aria-hidden="true" />,
    exact: true,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart2 size={15} aria-hidden="true" />,
  },
  {
    label: "API Keys",
    href: "/dashboard/api-keys",
    icon: <Key size={15} aria-hidden="true" />,
  },
];

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

  function isActive(item: NavItem) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-60 flex-col",
        // No bg — inherits the dark shell background from the layout
        "transition-transform duration-200 ease-in-out",
        "lg:relative lg:translate-x-0 lg:z-auto lg:h-full",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
      style={{ background: "#1B1A17" }}
      aria-label="Main navigation"
    >
      {/* ── Logo ──────────────────────────────────────────────── */}
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 font-mono text-[14.5px] font-semibold tracking-tight"
          style={{ color: "rgba(255,255,255,0.92)" }}
          onClick={onMobileClose}
        >
          Upload
          <span style={{ color: "var(--color-accent)" }}>Aura</span>
          <span
            aria-hidden="true"
            className="ml-0.5 h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-accent)" }}
          />
        </Link>

        {/* Mobile close button */}
        <button
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="lg:hidden flex h-7 w-7 items-center justify-center rounded-md transition-colors"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>

      {/* ── Navigation ────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-2"
        aria-label="Sidebar links"
      >
        <ul role="list" className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onMobileClose}
                  aria-current={active ? "page" : undefined}
                  className="flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-[13.5px] font-medium transition-all duration-100"
                  style={
                    active
                      ? {
                          background: "rgba(255,255,255,0.11)",
                          color: "rgba(255,255,255,0.95)",
                        }
                      : {
                          color: "rgba(255,255,255,0.50)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.80)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "";
                      e.currentTarget.style.color = "rgba(255,255,255,0.50)";
                    }
                  }}
                >
                  {/* Active pill indicator */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-3 h-4 w-0.5 rounded-r-full"
                      style={{ background: "var(--color-accent)" }}
                    />
                  )}
                  <span className="shrink-0">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom section ────────────────────────────────────── */}
      <div
        className="shrink-0 space-y-3 px-3 pb-4 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Storage bar — dark variant */}
        <StorageBar dark />

        {/* User row */}
        <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] px-1 py-1">
          {/* Avatar */}
          <div
            className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{ background: "rgba(184,115,51,0.25)" }}
          >
            {user?.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={user.name ?? "Profile picture"}
                fill
                sizes="28px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span
                className="text-[10px] font-bold leading-none"
                style={{ color: "var(--color-accent)" }}
              >
                {initials}
              </span>
            )}
          </div>

          {/* Name + email */}
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[12.5px] font-medium leading-tight"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {user?.name ?? "—"}
            </p>
            <p
              className="truncate text-[11px] leading-tight"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              {user?.email ?? ""}
            </p>
          </div>

          {/* Logout */}
          <button
            aria-label="Log out"
            onClick={logout}
            title="Log out"
            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.80)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
            }
          >
            <LogOut size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}

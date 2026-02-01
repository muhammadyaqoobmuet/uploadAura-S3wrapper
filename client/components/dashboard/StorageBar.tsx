"use client";

import React, { useEffect, useState } from "react";
import { getAnalytics, StorageUsageSummary } from "@/lib/api";
import { storagePercent, toISODate, subtractDays } from "@/lib/utils";

interface StorageBarProps {
  /** Render text/colors suitable for a dark sidebar background */
  dark?: boolean;
}

export function StorageBar({ dark = false }: StorageBarProps) {
  const [summary, setSummary] = useState<StorageUsageSummary | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const to = new Date();
    const from = subtractDays(to, 30);
    getAnalytics(toISODate(from), toISODate(to))
      .then((res) => setSummary(res.storageUsageSummary))
      .catch(() => setError(true));
  }, []);

  if (error) return null;

  if (!summary) {
    return (
      <div className="space-y-1.5 px-1">
        <div
          className="h-1.5 w-full animate-pulse rounded-full"
          style={{
            background: dark
              ? "rgba(255,255,255,0.10)"
              : "var(--color-surface-3)",
          }}
        />
        <div
          className="h-3 w-2/3 animate-pulse rounded"
          style={{
            background: dark
              ? "rgba(255,255,255,0.07)"
              : "var(--color-surface-3)",
          }}
        />
      </div>
    );
  }

  const pct = storagePercent(summary.totalUsage, summary.quota);

  const barFill =
    pct >= 95
      ? "var(--color-error)"
      : pct >= 80
        ? "var(--color-warning)"
        : "var(--color-accent)";

  const pctColor =
    pct >= 95
      ? "var(--color-error)"
      : pct >= 80
        ? "var(--color-warning)"
        : "var(--color-accent)";

  const labelColor = dark ? "rgba(255,255,255,0.40)" : "var(--color-ink-faint)";
  const trackBg = dark ? "rgba(255,255,255,0.10)" : "var(--color-surface-3)";

  return (
    <div className="space-y-1.5 px-1">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[11px] leading-none tabular-nums"
          style={{ color: labelColor }}
        >
          {summary.formattedTotalUsage} / {summary.formattedQuota}
        </span>
        <span
          className="font-mono text-[11px] font-medium leading-none tabular-nums"
          style={{ color: pctColor }}
        >
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label={`Storage: ${pct}% used`}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: trackBg }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: barFill }}
        />
      </div>

      {/* Remaining */}
      <p className="text-[10.5px] leading-none" style={{ color: labelColor }}>
        {summary.formattedRemaining} remaining
      </p>
    </div>
  );
}

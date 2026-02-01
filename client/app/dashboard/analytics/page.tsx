"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart2, HardDrive, TrendingUp, Upload } from "lucide-react";
import { getAnalytics, AnalyticsResponse, ChartPoint } from "@/lib/api";
import { storagePercent, toISODate, subtractDays } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * The API only returns days with uploads — fill the full date range with
 * zero-value points so the chart renders a continuous area with no gaps.
 */
function buildFilledChart(
  chart: ChartPoint[],
  fromStr: string,
  toStr: string,
): ChartPoint[] {
  const byDate = new Map<string, ChartPoint>(
    chart.map((p) => [p.date.slice(0, 10), p]),
  );
  const result: ChartPoint[] = [];
  const cursor = new Date(fromStr + "T00:00:00");
  const end = new Date(toStr + "T00:00:00");

  while (cursor <= end) {
    const key = toISODate(cursor);
    result.push(
      byDate.get(key) ?? {
        date: key,
        uploadedFiles: 0,
        usages: 0,
        formattedUsages: "0 B",
      },
    );
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

function fmtAxisDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr + "T00:00:00"));
}

function fmtFullDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr + "T00:00:00"));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-(--color-surface-2) ${
        className ?? ""
      }`}
    />
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const;

const INITIAL_FROM = toISODate(subtractDays(new Date(), 30));
const INITIAL_TO = toISODate(new Date());

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const toast = useToast();
  const reducedMotion = useReducedMotion();

  const [activePreset, setActivePreset] = useState<number>(1);
  const [from, setFrom] = useState(INITIAL_FROM);
  const [to, setTo] = useState(INITIAL_TO);
  // Start as loading=true so the initial useEffect never needs to call
  // setLoading(true) synchronously (which triggers a cascading render warning).
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  // Used only for user-triggered refetches (called from event handlers, not effects).
  const load = useCallback(
    async (fromDate: string, toDate: string) => {
      setLoading(true);
      try {
        const res = await getAnalytics(fromDate, toDate);
        setData(res);
        setChartData(buildFilledChart(res.chart, fromDate, toDate));
      } catch {
        toast.error("Failed to load analytics", "Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Initial fetch — all state updates happen inside async callbacks,
  // so no setState is called synchronously in the effect body.
  useEffect(() => {
    let active = true;

    getAnalytics(INITIAL_FROM, INITIAL_TO)
      .then((res) => {
        if (!active) return;
        setData(res);
        setChartData(buildFilledChart(res.chart, INITIAL_FROM, INITIAL_TO));
      })
      .catch(() => {
        if (!active) return;
        toast.error("Failed to load analytics", "Please try again.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyPreset(days: number, idx: number) {
    const newFrom = toISODate(subtractDays(new Date(), days));
    const newTo = toISODate(new Date());
    setActivePreset(idx);
    setFrom(newFrom);
    setTo(newTo);
    load(newFrom, newTo);
  }

  function onFromChange(val: string) {
    setActivePreset(-1);
    setFrom(val);
    if (val && to && val <= to) load(val, to);
  }

  function onToChange(val: string) {
    setActivePreset(-1);
    setTo(val);
    if (from && val && from <= val) load(from, val);
  }

  const summary = data?.storageUsageSummary;
  const pct = summary ? storagePercent(summary.totalUsage, summary.quota) : 0;
  const storageColor =
    pct > 95
      ? "var(--color-error)"
      : pct > 80
        ? "var(--color-warning)"
        : "var(--color-accent)";

  const hasChartData = chartData.some((d) => d.uploadedFiles > 0);
  const xTickInterval =
    chartData.length <= 10 ? 0 : chartData.length <= 30 ? 3 : 8;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-(--color-ink)">
          Analytics
        </h1>
        <p
          className="text-[14px] mt-0.5"
          style={{ color: "var(--color-ink-muted)" }}
        >
          Upload trends and storage usage for your account.
        </p>
      </div>

      {/* ── Date range controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
        {/* Quick-select preset tabs */}
        <div
          role="group"
          aria-label="Date range preset"
          className="flex items-center gap-0.5 p-1 rounded-lg self-start"
          style={{ background: "var(--color-surface-2)" }}
        >
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.days}
              onClick={() => applyPreset(preset.days, idx)}
              aria-pressed={activePreset === idx}
              className="relative px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors"
              style={{
                color:
                  activePreset === idx
                    ? "var(--color-ink)"
                    : "var(--color-ink-muted)",
              }}
            >
              {activePreset === idx && (
                <motion.span
                  layoutId="preset-bg"
                  className="absolute inset-0 rounded-md"
                  style={{
                    background: "var(--color-white)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                    zIndex: 0,
                  }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 500, damping: 40 }
                  }
                />
              )}
              <span className="relative" style={{ zIndex: 1 }}>
                {preset.label}
              </span>
            </button>
          ))}
        </div>

        {/* Manual date pickers */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => onFromChange(e.target.value)}
            className="input-base py-1.5! px-2.5! text-[13px]! w-auto!"
            aria-label="Start date"
          />
          <span
            className="text-[13px] select-none"
            style={{ color: "var(--color-ink-faint)" }}
          >
            to
          </span>
          <input
            type="date"
            value={to}
            min={from}
            max={toISODate(new Date())}
            onChange={(e) => onToChange(e.target.value)}
            className="input-base py-1.5! px-2.5! text-[13px]! w-auto!"
            aria-label="End date"
          />
        </div>
      </div>

      {/* ── Summary cards ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-27" />
          <Skeleton className="h-27" />
          <Skeleton className="h-27" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Files uploaded */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "var(--color-accent-light)" }}
              >
                <Upload size={15} style={{ color: "var(--color-accent)" }} />
              </span>
              <span
                className="text-[13px]"
                style={{ color: "var(--color-ink-muted)" }}
              >
                Files Uploaded
              </span>
            </div>
            <p
              className="text-[28px] font-semibold tracking-[-0.02em]"
              style={{
                color: "var(--color-ink)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {data?.totalUploadedFilesForPeriod ?? 0}
            </p>
            <p
              className="text-[12px] mt-0.5"
              style={{ color: "var(--color-ink-faint)" }}
            >
              in selected period
            </p>
          </div>

          {/* Data transferred */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "var(--color-accent-light)" }}
              >
                <TrendingUp
                  size={15}
                  style={{ color: "var(--color-accent)" }}
                />
              </span>
              <span
                className="text-[13px]"
                style={{ color: "var(--color-ink-muted)" }}
              >
                Data Transferred
              </span>
            </div>
            <p
              className="text-[28px] font-semibold tracking-[-0.02em]"
              style={{
                color: "var(--color-ink)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {data?.totalUsagesForPeriod ?? "0 B"}
            </p>
            <p
              className="text-[12px] mt-0.5"
              style={{ color: "var(--color-ink-faint)" }}
            >
              in selected period
            </p>
          </div>

          {/* Storage used */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "var(--color-accent-light)" }}
              >
                <HardDrive size={15} style={{ color: "var(--color-accent)" }} />
              </span>
              <span
                className="text-[13px]"
                style={{ color: "var(--color-ink-muted)" }}
              >
                Storage Used
              </span>
            </div>
            <p
              className="font-semibold tracking-[-0.02em] leading-none"
              style={{
                color: "var(--color-ink)",
                fontVariantNumeric: "tabular-nums",
                fontSize: "clamp(18px, 3vw, 26px)",
              }}
            >
              {summary?.formattedTotalUsage ?? "0 B"}
              <span
                className="font-normal"
                style={{ color: "var(--color-ink-muted)", fontSize: "15px" }}
              >
                {" "}
                / {summary?.formattedQuota ?? "—"}
              </span>
            </p>
            <p
              className="text-[12px] mt-1.5"
              style={{ color: "var(--color-ink-faint)" }}
            >
              {pct}% used
            </p>
          </div>
        </div>
      )}

      {/* ── Upload chart ── */}
      <div className="card p-5">
        <h2
          className="text-[15px] font-semibold mb-5"
          style={{ color: "var(--color-ink)" }}
        >
          Uploads over time
        </h2>

        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : !hasChartData ? (
          <div className="h-56 flex flex-col items-center justify-center gap-2 text-center">
            <BarChart2 size={32} style={{ color: "var(--color-ink-faint)" }} />
            <p
              className="text-[14px] font-medium"
              style={{ color: "var(--color-ink)" }}
            >
              No uploads in this period
            </p>
            <p
              className="text-[13px]"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Upload some files to see your trends here.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={224}>
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="copperGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-accent)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-accent)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={fmtAxisDate}
                interval={xTickInterval}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-ink-faint)",
                  fontFamily: "var(--font-sans)",
                }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-ink-faint)",
                  fontFamily: "var(--font-sans)",
                }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                cursor={{
                  stroke: "var(--color-border-2)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={(props) => {
                  const { active, payload, label } = props;
                  if (!active || !payload?.length) return null;
                  const point = payload[0].payload as ChartPoint;
                  const dateLabel =
                    typeof label === "string" ? label : String(label ?? "");
                  return (
                    <div
                      className="card shadow-md"
                      style={{ padding: "10px 14px", minWidth: 148 }}
                    >
                      <p
                        className="text-[11px] mb-1.5"
                        style={{ color: "var(--color-ink-muted)" }}
                      >
                        {fmtFullDate(dateLabel)}
                      </p>
                      <p
                        className="text-[13px] font-semibold"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {point.uploadedFiles}{" "}
                        {point.uploadedFiles === 1 ? "file" : "files"}
                      </p>
                      <p
                        className="text-[12px]"
                        style={{ color: "var(--color-ink-muted)" }}
                      >
                        {point.formattedUsages}
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="uploadedFiles"
                stroke="var(--color-accent)"
                strokeWidth={2}
                fill="url(#copperGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "var(--color-accent)",
                  stroke: "var(--color-white)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Storage usage bar ── */}
      {!loading && summary && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[15px] font-semibold"
              style={{ color: "var(--color-ink)" }}
            >
              Storage Quota
            </h2>
            <span
              className="text-[13px] font-medium"
              style={{
                color: storageColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {pct}%
            </span>
          </div>

          {/* Progress track */}
          <div
            className="h-2 w-full rounded-full overflow-hidden"
            style={{ background: "var(--color-surface-2)" }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Storage used: ${pct}%`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: storageColor }}
              initial={{ width: reducedMotion ? `${pct}%` : "0%" }}
              animate={{ width: `${pct}%` }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
              }
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span
              className="text-[12px]"
              style={{
                color: "var(--color-ink-muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {summary.formattedTotalUsage} used
            </span>
            <span
              className="text-[12px]"
              style={{
                color: "var(--color-ink-faint)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {summary.formattedRemaining} of {summary.formattedQuota} remaining
            </span>
          </div>

          {pct > 95 && (
            <p
              className="text-[12px] font-medium mt-2"
              style={{ color: "var(--color-error)" }}
            >
              Storage almost full. Delete old files to free up space.
            </p>
          )}
          {pct > 80 && pct <= 95 && (
            <p
              className="text-[12px] font-medium mt-2"
              style={{ color: "var(--color-warning)" }}
            >
              Storage is getting low.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

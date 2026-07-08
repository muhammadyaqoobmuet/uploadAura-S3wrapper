"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Check, Copy, Key, Plus, Trash2 } from "lucide-react";
import {
  getApiKeys,
  createApiKey,
  deleteApiKey,
  ApiKey,
  Pagination,
} from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/hooks/useSound";
import { confirmation001Sound } from "@/lib/confirmation-001";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <tr key={i} className="border-b border-(--color-border)">
          <td className="px-5 py-4">
            <div className="flex flex-col gap-2">
              <div
                className="h-3.5 w-32 rounded animate-pulse"
                style={{ background: "var(--color-surface-2)" }}
              />
              <div
                className="h-3 w-48 rounded animate-pulse"
                style={{ background: "var(--color-surface-2)" }}
              />
            </div>
          </td>
          <td className="px-5 py-4">
            <div
              className="h-3.5 w-20 rounded animate-pulse"
              style={{ background: "var(--color-surface-2)" }}
            />
          </td>
          <td className="px-5 py-4">
            <div
              className="h-3.5 w-24 rounded animate-pulse"
              style={{ background: "var(--color-surface-2)" }}
            />
          </td>
          <td className="px-5 py-4">
            <div
              className="h-7 w-17 rounded animate-pulse"
              style={{ background: "var(--color-surface-2)" }}
            />
          </td>
        </tr>
      ))}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiKeysPage() {
  const toast = useToast();
  const playDeleteSound = useSound(confirmation001Sound, 0.65);

  // ── List state ──
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  // Start as true so the initial fetch effect doesn't need to call
  // setLoading(true) synchronously (which would trigger a cascading-render warning).
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // ── Create modal ──
  const [createOpen, setCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [nameError, setNameError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // ── New key display modal (key shown exactly once) ──
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showKeyOpen, setShowKeyOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Delete modal ──
  const [deleteTarget, setDeleteTarget] = useState<ApiKey | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Data fetching ──

  // Used for user-triggered page changes (called from event handlers, not effects).
  const fetchKeys = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      try {
        const res = await getApiKeys({
          pageSize: PAGE_SIZE,
          pageNumber: pageNum,
        });
        setKeys(res.apiKeys);
        setPagination(res.pagination);
      } catch {
        toast.error("Failed to load API keys", "Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // Initial fetch — all state updates happen inside async callbacks so no
  // setState is called synchronously in the effect body.
  useEffect(() => {
    let active = true;

    getApiKeys({ pageSize: PAGE_SIZE, pageNumber: 1 })
      .then((res) => {
        if (!active) return;
        setKeys(res.apiKeys);
        setPagination(res.pagination);
      })
      .catch(() => {
        if (!active) return;
        toast.error("Failed to load API keys", "Please try again.");
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

  // ── Create flow ──

  function openCreate() {
    setKeyName("");
    setNameError("");
    setCreateOpen(true);
  }

  async function handleCreate() {
    const trimmed = keyName.trim();
    if (!trimmed) {
      setNameError("Key name is required.");
      return;
    }
    if (trimmed.length > 50) {
      setNameError("Name must be 50 characters or fewer.");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await createApiKey(trimmed);
      setCreateOpen(false);
      setNewKey(res.key);
      setCopied(false);
      setShowKeyOpen(true);
      // Refresh list on page 1 in the background
      setPage(1);
      fetchKeys(1);
    } catch {
      toast.error("Failed to create API key", "Please try again.");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleCopy() {
    if (!newKey) return;
    try {
      await navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.warning(
        "Copy failed",
        "Select all text in the key field and copy it manually.",
      );
    }
  }

  function handleSavedKey() {
    setShowKeyOpen(false);
    setNewKey(null);
    setCopied(false);
  }

  // ── Delete flow ──

  function openDelete(key: ApiKey) {
    setDeleteTarget(key);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteApiKey(deleteTarget._id);
      playDeleteSound();
      toast.success("API key deleted");
      setDeleteTarget(null);
      setPage(1);
      fetchKeys(1);
    } catch {
      toast.error("Failed to delete API key", "Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Pagination ──

  function handlePageChange(newPage: number) {
    setPage(newPage);
    fetchKeys(newPage);
  }

  const totalPages = pagination?.totalPages ?? 1;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-(--color-ink)">
            API Keys
          </h1>
          <p
            className="text-[14px] mt-0.5"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Generate API keys to upload files programmatically via the SDK.
          </p>
        </div>
        <Button
          variant="accent"
          leftIcon={<Plus size={15} aria-hidden="true" />}
          onClick={openCreate}
        >
          Create API Key
        </Button>
      </div>

      {/* ── Key list ── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-140">
            {/* Table head */}
            <thead>
              <tr
                className="border-b border-(--color-border)"
                style={{ background: "var(--color-surface)" }}
              >
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-[11.5px] font-medium uppercase tracking-wide"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-[11.5px] font-medium uppercase tracking-wide"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Last Used
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-[11.5px] font-medium uppercase tracking-wide"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Created
                </th>
                <th scope="col" className="px-5 py-3" />
              </tr>
            </thead>

            {/* Table body */}
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : keys.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <span
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ background: "var(--color-surface-2)" }}
                      >
                        <Key
                          size={22}
                          style={{ color: "var(--color-ink-faint)" }}
                        />
                      </span>
                      <div>
                        <p
                          className="text-[15px] font-medium"
                          style={{ color: "var(--color-ink)" }}
                        >
                          No API keys yet
                        </p>
                        <p
                          className="text-[13px] mt-0.5"
                          style={{ color: "var(--color-ink-muted)" }}
                        >
                          Create one to get started.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                keys.map((apiKey) => (
                  <tr
                    key={apiKey._id}
                    className="border-b border-(--color-border) transition-colors hover:bg-(--color-surface)"
                  >
                    {/* Name + masked key */}
                    <td className="px-5 py-4 max-w-60">
                      <p
                        className="text-[14px] font-medium truncate"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {apiKey.name}
                      </p>
                      <p
                        className="text-[12px] mt-0.5 truncate font-mono"
                        style={{
                          color: "var(--color-ink-muted)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {apiKey.displayKey}
                      </p>
                    </td>

                    {/* Last used */}
                    <td
                      className="px-5 py-4 text-[13px] whitespace-nowrap"
                      style={{
                        color: apiKey.lastUsedAt
                          ? "var(--color-ink-muted)"
                          : "var(--color-ink-faint)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {apiKey.lastUsedAt
                        ? formatDate(apiKey.lastUsedAt)
                        : "Never"}
                    </td>

                    {/* Created */}
                    <td
                      className="px-5 py-4 text-[13px] whitespace-nowrap"
                      style={{
                        color: "var(--color-ink-faint)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(apiKey.createdAt)}
                    </td>

                    {/* Delete action */}
                    <td className="px-5 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 size={13} aria-hidden="true" />}
                        onClick={() => openDelete(apiKey)}
                        aria-label={`Delete API key "${apiKey.name}"`}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3 border-t border-(--color-border)"
            style={{ background: "var(--color-surface)" }}
          >
            <span
              className="text-[13px]"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────
          Modal: Create API Key
      ──────────────────────────────────────────────── */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create API Key"
        description="Give your key a name so you can identify it later."
        size="sm"
      >
        <div className="flex flex-col gap-4 mt-1">
          <Input
            label="Key name"
            placeholder="e.g. Production, CI/CD Pipeline"
            value={keyName}
            error={nameError}
            hint="Up to 50 characters."
            maxLength={50}
            autoFocus
            onChange={(e) => {
              setKeyName(e.target.value);
              if (nameError) setNameError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              loading={createLoading}
              onClick={handleCreate}
            >
              Generate Key
            </Button>
          </div>
        </div>
      </Modal>

      {/* ────────────────────────────────────────────────
          Modal: Show new key (shown ONCE — backdrop close disabled)
      ──────────────────────────────────────────────── */}
      <Modal
        open={showKeyOpen}
        onClose={handleSavedKey}
        title="Your API Key"
        size="md"
        disableBackdropClose
      >
        <div className="flex flex-col gap-4 mt-1">
          {/* Warning banner */}
          <div
            role="alert"
            className="flex items-start gap-3 rounded-md border px-4 py-3"
            style={{
              background: "var(--color-warning-light)",
              borderColor: "rgba(230,126,34,0.25)",
            }}
          >
            <AlertTriangle
              size={16}
              className="shrink-0 mt-px"
              style={{ color: "var(--color-warning)" }}
              aria-hidden="true"
            />
            <p className="text-[13px]" style={{ color: "var(--color-ink)" }}>
              <strong>This key is shown only once.</strong> Copy it now — it
              cannot be recovered if you close this dialog.
            </p>
          </div>

          {/* Raw key display — select-all makes it easy to copy manually too */}
          <div
            className="rounded-md border px-4 py-3 select-all break-all font-mono text-[13px] leading-relaxed"
            style={{
              background: "var(--color-surface-2)",
              borderColor: "var(--color-border)",
              color: "var(--color-ink)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {newKey}
          </div>

          {/* Copy button — changes appearance on success for 2s */}
          <button
            onClick={handleCopy}
            className={
              copied
                ? "btn-secondary text-(--color-success)! border-[rgba(39,174,96,0.3)]! bg-(--color-success-light)!"
                : "btn-secondary"
            }
            style={{ gap: 6 }}
          >
            {copied ? (
              <>
                <Check size={14} aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden="true" />
                Copy to clipboard
              </>
            )}
          </button>

          {/* Confirm button — required to dismiss */}
          <Button variant="primary" onClick={handleSavedKey}>
            I&apos;ve saved my key
          </Button>
        </div>
      </Modal>

      {/* ────────────────────────────────────────────────
          Modal: Delete confirmation
      ──────────────────────────────────────────────── */}
      <Modal
        open={!!deleteTarget}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        title="Delete API Key"
        size="sm"
      >
        <div className="flex flex-col gap-4 mt-1">
          <p
            className="text-[14px]"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Deleting{" "}
            <strong style={{ color: "var(--color-ink)" }}>
              &ldquo;{deleteTarget?.name}&rdquo;
            </strong>{" "}
            will immediately break any integrations using this key. This cannot
            be undone.
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              disabled={deleteLoading}
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              loading={deleteLoading}
              onClick={handleDelete}
            >
              Delete Key
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

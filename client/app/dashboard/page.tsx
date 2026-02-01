"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UploadZone } from "@/components/dashboard/UploadZone";
import { FileList } from "@/components/dashboard/FileList";

export default function FilesPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Bump the key to trigger FileList to re-fetch
    setRefreshKey((k) => k + 1);
    // Collapse the upload zone so the user can see the refreshed list
    setShowUpload(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[var(--color-ink)]">
            Files
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--color-ink-muted)]">
            All your uploaded files in one place
          </p>
        </div>

        <Button
          variant="accent"
          size="sm"
          leftIcon={<Upload size={14} aria-hidden="true" />}
          onClick={() => setShowUpload((v) => !v)}
          aria-expanded={showUpload}
          aria-controls="upload-zone"
        >
          {showUpload ? "Hide uploader" : "Upload files"}
        </Button>
      </div>

      {/* ── Upload zone (collapsible) ────────────────────────── */}
      <AnimatePresence initial={false}>
        {showUpload && (
          <motion.div
            id="upload-zone"
            key="upload-zone"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 overflow-hidden"
          >
            <UploadZone onSuccess={handleUploadSuccess} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── File list ────────────────────────────────────────── */}
      <FileList refreshTrigger={refreshKey} />
    </div>
  );
}

import type { Metadata } from "next";
import DocsLanding from "@/components/docs/DocsLanding";

export const metadata: Metadata = {
  title: "SDK Documentation",
  description:
    "UploadAura SDK docs — install, authenticate, and upload files from Node.js with one method. Paths, Buffers, and streams supported.",
};

export default function DocsPage() {
  return <DocsLanding />;
}

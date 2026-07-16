import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const metadata: Metadata = {
  title: "Privacy & Policy",
  description:
    "How UploadAura stores, protects, and handles your files and account data.",
};

const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    body: "UploadAura (the “Service”) is a thin storage layer over Amazon S3. This policy explains what data we collect, how we use it, and the choices you have. By using the Service you agree to the practices described here.",
  },
  {
    id: "files",
    title: "Your files",
    body: "Files you upload are stored in the S3 bucket associated with your account and served back exactly as uploaded. We do not scan, read the contents of, train on, or resell your files. Objects that you mark private are never exposed via a public URL unless you explicitly generate a signed link.",
  },
  {
    id: "accounts",
    title: "Account data",
    body: "We collect the information you provide at sign-up (email address and password, stored hashed) plus usage metadata such as storage consumed and request counts. This is used to operate your account, enforce plan limits, and provide support.",
  },
  {
    id: "logs",
    title: "Logs & analytics",
    body: "We retain request logs (timestamps, object keys, response codes, byte counts) for up to 30 days to debug errors and prevent abuse. These logs are not used to profile the contents of your files and are deleted on a rolling basis.",
  },
  {
    id: "cookies",
    title: "Cookies",
    body: "We use a minimal set of first-party cookies to keep you signed in and to remember interface preferences such as theme. We do not use third-party advertising or tracking cookies.",
  },
  {
    id: "retention",
    title: "Data retention",
    body: "Your files remain available as long as your account is active. If an account is cancelled, stored objects and associated metadata are permanently deleted within 30 days. You may delete individual files at any time, which removes them immediately.",
  },
  {
    id: "security",
    title: "Security",
    body: "All traffic is encrypted in transit with TLS. Objects at rest are encrypted by Amazon S3. Access is scoped per-account via signed API keys, and private files require short-lived signed URLs that expire automatically.",
  },
  {
    id: "third-parties",
    title: "Third parties",
    body: "The Service relies on Amazon Web Services for storage and CDN delivery. We do not share your personal data with advertisers. Service providers who process data on our behalf are bound by confidentiality obligations consistent with this policy.",
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time. To exercise these rights or ask questions, contact us at privacy@uploadaura.dev.",
  },
  {
    id: "changes",
    title: "Changes",
    body: "We may update this policy as the Service evolves. Material changes will be announced via the email on file or a notice in the dashboard. Continued use after changes take effect constitutes acceptance of the revised policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <div className="privacy-header-inner">
          <Link href="/" className="privacy-brand" aria-label="UploadAura home">
            <BrandLogo className="h-8 w-auto" />
          </Link>
          <Link href="/" className="privacy-back">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="privacy-main">
        <div className="privacy-hero">
          <span className="privacy-eyebrow">Legal</span>
          <h1>Privacy &amp; Policy</h1>
          <p className="privacy-updated">Last updated: July 16, 2026</p>
        </div>

        <div className="privacy-grid">
          <nav className="privacy-toc" aria-label="Policy sections">
            <p className="privacy-toc-label">On this page</p>
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="privacy-content">
            {SECTIONS.map((s) => (
              <section id={s.id} key={s.id} className="privacy-section">
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}
          </article>
        </div>
      </main>

      <footer className="privacy-footer">
        <span>© 2026 UploadAura — Cloud Storage API</span>
        <Link href="/docs">SDK Docs</Link>
      </footer>

      <style jsx global>{`
        .privacy-page {
          --accent: #ff603d;
          --ink: #0f0f10;
          --muted: #6e6c67;
          --border: #eae8e3;
          --bg: #ffffff;
          --bg-2: #fafaf9;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg);
          color: var(--ink);
          min-height: 100vh;
        }
        .privacy-header {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
        }
        .privacy-header-inner {
          max-width: 1040px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .privacy-back {
          font-size: 14px;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .privacy-back:hover {
          color: var(--ink);
        }
        .privacy-main {
          max-width: 1040px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }
        .privacy-hero {
          margin-bottom: 48px;
        }
        .privacy-eyebrow {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 12px;
        }
        .privacy-hero h1 {
          font-size: 44px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .privacy-updated {
          margin-top: 12px;
          color: var(--muted);
          font-size: 14px;
        }
        .privacy-grid {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 48px;
          align-items: start;
        }
        .privacy-toc {
          position: sticky;
          top: 96px;
        }
        .privacy-toc-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }
        .privacy-toc ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .privacy-toc a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .privacy-toc a:hover {
          color: var(--accent);
        }
        .privacy-content {
          max-width: 680px;
        }
        .privacy-section {
          padding: 8px 0 32px;
          border-bottom: 1px solid var(--border);
          scroll-margin-top: 96px;
        }
        .privacy-section:last-child {
          border-bottom: none;
        }
        .privacy-section h2 {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0 0 10px;
        }
        .privacy-section p {
          margin: 0;
          color: #3a3a3c;
          font-size: 16px;
          line-height: 1.7;
        }
        .privacy-footer {
          max-width: 1040px;
          margin: 0 auto;
          padding: 28px 24px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border);
          color: var(--muted);
          font-size: 14px;
        }
        .privacy-footer a {
          color: var(--muted);
          text-decoration: none;
        }
        .privacy-footer a:hover {
          color: var(--ink);
        }
        @media (max-width: 760px) {
          .privacy-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .privacy-toc {
            position: static;
          }
          .privacy-hero h1 {
            font-size: 34px;
          }
        }
      `}</style>
    </div>
  );
}

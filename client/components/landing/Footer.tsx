import Link from "next/link";

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/docs/api" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="pt-16 pb-10"
      style={{ borderTop: "1px solid var(--color-border)" }}
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Top row ── */}
        <div
          className="grid grid-cols-2 md:grid-cols-[1fr_auto_auto_auto] gap-10 md:gap-16 pb-12"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Brand */}
          <div
            className="col-span-2 md:col-span-1 flex flex-col gap-4"
            style={{ maxWidth: "260px" }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 w-fit"
              aria-label="UploadAura home"
            >
              <span
                className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                <span
                  className="absolute inset-0 rounded-[4px]"
                  style={{ background: "var(--color-accent)", opacity: 0.14 }}
                />
                <span
                  className="h-[7px] w-[7px] rounded-full"
                  style={{ background: "var(--color-accent)" }}
                />
              </span>
              <span
                className="text-[14px] font-medium tracking-tight"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-ink)",
                }}
              >
                UploadAura
              </span>
            </Link>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Simple, fast cloud storage and file sharing for developers. 2 GB
              free. No infrastructure headaches.
            </p>
            <Link
              href="/register"
              className="btn-primary self-start !text-[13px] !py-2 !px-4"
            >
              Get started free
            </Link>
          </div>

          {/* Nav columns */}
          {FOOTER_COLS.map((col) => (
            <nav key={col.heading} aria-label={`${col.heading} links`}>
              <p
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: "var(--color-ink-faint)" }}
              >
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="footer-link text-[13px] font-medium"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Bottom row ── */}
        <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p
            className="text-[12px]"
            style={{
              color: "var(--color-ink-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            &copy; {currentYear} UploadAura. All rights reserved.
          </p>
          <p
            className="text-[12px]"
            style={{ color: "var(--color-ink-faint)" }}
          >
            Built with care for developers.
          </p>
        </div>
      </div>
    </footer>
  );
}

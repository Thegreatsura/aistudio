"use client";

import Link from "next/link";
import { IconBrandX, IconBrandLinkedin } from "@tabler/icons-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="px-6 py-16"
      style={{
        backgroundColor: "var(--landing-bg-alt)",
        borderTop: "1px solid var(--landing-border)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-semibold tracking-tight"
              style={{ color: "var(--landing-text)" }}
            >
              AI Studio
            </Link>
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--landing-text-muted)" }}
            >
              Transform your real estate photos with AI-powered enhancements.
              Professional results in seconds.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full transition-colors hover:opacity-70"
                style={{
                  backgroundColor: "var(--landing-bg)",
                  border: "1px solid var(--landing-border)",
                }}
                aria-label="Follow us on X (Twitter)"
              >
                <IconBrandX
                  className="size-4"
                  style={{ color: "var(--landing-text)" }}
                />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full transition-colors hover:opacity-70"
                style={{
                  backgroundColor: "var(--landing-bg)",
                  border: "1px solid var(--landing-border)",
                }}
                aria-label="Follow us on LinkedIn"
              >
                <IconBrandLinkedin
                  className="size-4"
                  style={{ color: "var(--landing-text)" }}
                />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--landing-text)" }}
            >
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-70"
                    style={{ color: "var(--landing-text-muted)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--landing-text)" }}
            >
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-70"
                    style={{ color: "var(--landing-text-muted)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--landing-text)" }}
            >
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-70"
                    style={{ color: "var(--landing-text-muted)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: "var(--landing-border)" }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--landing-text-muted)" }}
          >
            &copy; {currentYear} AI Studio. All rights reserved.
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--landing-text-muted)" }}
          >
            Made with care in Norway
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

const benefits = [
  "No credit card required",
  "Free trial included",
  "Cancel anytime",
];

function CtaAuthButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div
        className="h-14 w-48 rounded-full animate-pulse"
        style={{ backgroundColor: "var(--landing-border)" }}
      />
    );
  }

  const href = session ? "/dashboard" : "/sign-in";
  const text = session ? "Go to Dashboard" : "Get Started Free";

  return (
    <Link
      href={href}
      className="inline-flex h-14 items-center gap-2.5 rounded-full px-8 text-lg font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
      style={{
        backgroundColor: "var(--landing-card)",
        color: "var(--landing-text)",
        boxShadow: "0 8px 32px -8px var(--landing-shadow)",
      }}
    >
      {text}
      <IconArrowRight className="size-5" />
    </Link>
  );
}

export function LandingCta() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-6 py-24 md:py-32"
      style={{ backgroundColor: "var(--landing-accent)" }}
    >
      {/* Decorative circles */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full"
        style={{
          backgroundColor: "var(--landing-accent-foreground)",
          opacity: 0.05,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full"
        style={{
          backgroundColor: "var(--landing-accent-foreground)",
          opacity: 0.05,
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          style={{ color: "var(--landing-accent-foreground)" }}
        >
          Start Creating Stunning
          <br />
          Listings Today
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-lg leading-relaxed"
          style={{
            color: "var(--landing-accent-foreground)",
            opacity: 0.85,
          }}
        >
          Join top real estate professionals. Create professional photos in
          seconds, not hours.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <Suspense
            fallback={
              <div
                className="mx-auto h-14 w-48 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--landing-border)" }}
              />
            }
          >
            <CtaAuthButton />
          </Suspense>
        </div>

        {/* Benefits */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-2 text-sm"
              style={{
                color: "var(--landing-accent-foreground)",
                opacity: 0.9,
              }}
            >
              <IconCheck className="size-4" />
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/home/sections/site-header";

/**
 * Catches runtime errors thrown anywhere below the root layout, so an
 * unhandled throw renders a recoverable screen instead of a blank page.
 * Errors in the root layout itself bubble past this to global-error.tsx.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow flex flex-col items-center justify-center pt-32 px-4 gap-4 text-center">
        <span className="material-symbols-outlined text-[32px] text-on-surface-variant">
          error
        </span>
        <p className="font-headline-md text-on-surface">Something went wrong</p>
        <p className="font-body-md text-on-surface-variant max-w-md">
          This page ran into an unexpected problem. Trying again usually fixes it —
          your saved work is unaffected.
        </p>

        {error.digest && (
          <p className="font-label-sm text-on-surface-variant">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2 flex-wrap justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-primary-container text-white font-label-lg px-5 py-2.5 rounded-full hover:bg-primary transition-colors"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center border border-surface-variant text-on-surface font-label-lg px-5 py-2.5 rounded-full hover:bg-surface-subtle transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

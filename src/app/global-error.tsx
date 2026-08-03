"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Last-resort boundary for errors thrown in the root layout itself, which
 * bubble past app/error.tsx. This replaces the whole document, so it must
 * render its own <html>/<body> and cannot depend on anything the root
 * layout provides (fonts, SessionProvider, SiteHeader).
 */
export default function GlobalError({
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
    <html lang="en">
      <body className="bg-background text-on-surface font-sans antialiased">
        <main className="min-h-screen flex flex-col items-center justify-center px-4 gap-4 text-center">
          <p className="text-2xl font-semibold">Something went wrong</p>
          <p className="text-sm text-on-surface-variant max-w-md">
            Scriber ran into an unexpected problem while loading. Please try again.
          </p>

          {error.digest && (
            <p className="text-xs text-on-surface-variant">Reference: {error.digest}</p>
          )}

          <button
            type="button"
            onClick={reset}
            className="mt-2 inline-flex items-center justify-center bg-primary-container text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-primary transition-colors"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

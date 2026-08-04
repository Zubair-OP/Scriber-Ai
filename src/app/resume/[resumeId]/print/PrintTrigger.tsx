"use client";

import { useEffect } from "react";

/**
 * Auto-triggers window.print() once the page has fully loaded.
 * Placed on the resume print page so the browser's Save-as-PDF dialog
 * opens automatically when a new window is opened for PDF download.
 */
export function PrintTrigger() {
  useEffect(() => {
    // Small delay to ensure all fonts/styles are fully loaded
    const timer = setTimeout(() => {
      window.print();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

export function AutoPrintTrigger() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

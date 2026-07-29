"use client";

import Link from "next/link";
import { useState } from "react";

interface AIActionButtonProps {
  label: string;
  loadingLabel?: string;
  onRun: () => Promise<void>;
  className?: string;
}

function getErrorInfo(err: unknown): { status?: number; message?: string } {
  if (err && typeof err === "object" && "response" in err) {
    const resErr = err as { response?: { status?: number; data?: { message?: string } } };
    return { status: resErr.response?.status, message: resErr.response?.data?.message };
  }
  return {};
}

export function AIActionButton({ label, loadingLabel, onRun, className = "" }: AIActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError("");
    setLocked(false);

    try {
      await onRun();
    } catch (err) {
      const { status, message } = getErrorInfo(err);
      if (status === 403) {
        setLocked(true);
      } else {
        setError(message || "AI request failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 bg-primary/8 text-primary font-label-sm px-3 py-1.5 rounded-full border border-primary/15 hover:bg-primary/12 transition-colors disabled:opacity-50 ${className}`}
      >
        <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
        {loading ? loadingLabel || "Generating..." : label}
      </button>

      {locked && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-on-surface-variant">This is a Pro feature.</span>
          <Link href="/pricing" className="font-semibold text-primary-container hover:text-primary underline">
            Upgrade
          </Link>
        </div>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

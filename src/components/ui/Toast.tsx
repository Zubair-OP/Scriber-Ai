"use client";

import { useEffect, useState, useCallback, createContext, useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type ToastType = "success" | "error" | "loading" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // ms, 0 = persistent
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  updateToast: (id: string, updates: Partial<Omit<Toast, "id">>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const scheduleRemoval = useCallback(
    (id: string, duration: number) => {
      const existing = timers.current.get(id);
      if (existing) clearTimeout(existing);
      if (duration > 0) {
        const timer = setTimeout(() => removeToast(id), duration);
        timers.current.set(id, timer);
      }
    },
    [removeToast]
  );

  const addToast = useCallback(
    (toast: Omit<Toast, "id">): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const duration = toast.duration ?? (toast.type === "loading" ? 0 : 4000);
      setToasts((prev) => [...prev, { ...toast, id, duration }]);
      scheduleRemoval(id, duration);
      return id;
    },
    [scheduleRemoval]
  );

  const updateToast = useCallback(
    (id: string, updates: Partial<Omit<Toast, "id">>) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
      const newDuration =
        updates.duration ?? (updates.type && updates.type !== "loading" ? 4000 : undefined);
      if (newDuration !== undefined) {
        scheduleRemoval(id, newDuration);
      }
    },
    [scheduleRemoval]
  );

  // Cleanup on unmount
  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, updateToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#16a34a" />
      <path d="M4.5 8L7 10.5L11.5 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconError() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#dc2626" />
      <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#2563eb" />
      <path d="M8 7.5V11M8 5.5V5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="animate-spin"
    >
      <circle cx="8" cy="8" r="6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="10" />
    </svg>
  );
}

// ─── Individual Toast ──────────────────────────────────────────────────────────

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = {
    success: <IconCheck />,
    error: <IconError />,
    loading: <SpinnerIcon />,
    info: <IconInfo />,
  }[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex items-start gap-3 bg-white border border-surface-variant/60 shadow-lg rounded-2xl px-4 py-3 w-80 max-w-[calc(100vw-2rem)] pointer-events-auto"
    >
      <div className="mt-0.5 shrink-0">{Icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-label-lg text-on-surface leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="font-label-sm text-on-surface-variant mt-0.5 leading-snug">{toast.description}</p>
        )}
      </div>
      {toast.type !== "loading" && (
        <button
          type="button"
          onClick={() => onRemove(toast.id)}
          className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors -mr-1 -mt-0.5 p-1 rounded-full hover:bg-surface-subtle"
          aria-label="Dismiss"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TEMPLATE_COMPONENTS, TEMPLATE_LABELS } from "@/components/builder/templates";
import type { ResumeDraft } from "@/components/builder/types";
import { RESUME_TEMPLATES, type ResumeTemplate } from "@/types/resume.types";

const PAGE_WIDTH = 800;
const PAGE_HEIGHT = 1131;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2;
const CONTAINER_PADDING = 64;

interface FullscreenPreviewModalProps {
  open: boolean;
  onClose: () => void;
  resume: ResumeDraft;
  onTemplateChange: (template: ResumeTemplate) => void;
}

/**
 * The modal's content is mounted only while `open` is true (via AnimatePresence
 * below), so `PreviewModalContent` gets a fresh instance — and a fresh `zoom`
 * state starting at 1 — every time it opens, with no reset effect needed.
 */
export function FullscreenPreviewModal({ open, onClose, resume, onTemplateChange }: FullscreenPreviewModalProps) {
  return (
    <AnimatePresence>
      {open && <PreviewModalContent resume={resume} onClose={onClose} onTemplateChange={onTemplateChange} />}
    </AnimatePresence>
  );
}

function PreviewModalContent({
  resume,
  onClose,
  onTemplateChange,
}: {
  resume: ResumeDraft;
  onClose: () => void;
  onTemplateChange: (template: ResumeTemplate) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const currentIndex = RESUME_TEMPLATES.indexOf(resume.template);

  const cycleTemplate = (direction: 1 | -1) => {
    const nextIndex = (currentIndex + direction + RESUME_TEMPLATES.length) % RESUME_TEMPLATES.length;
    onTemplateChange(RESUME_TEMPLATES[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") cycleTemplate(-1);
      if (e.key === "ArrowRight") cycleTemplate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const fitWidth = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth - CONTAINER_PADDING;
    setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, width / PAGE_WIDTH)));
  };

  const fitPage = () => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth - CONTAINER_PADDING;
    const height = containerRef.current.clientHeight - CONTAINER_PADDING;
    setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(width / PAGE_WIDTH, height / PAGE_HEIGHT))));
  };

  const Template = TEMPLATE_COMPONENTS[resume.template];
  const transition = { duration: reduceMotion ? 0 : 0.25 };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      role="dialog"
      aria-modal="true"
      aria-label="Resume preview"
    >
      <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4 text-white flex-wrap">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => cycleTemplate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Previous template"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <p className="font-label-lg min-w-[110px] text-center">{TEMPLATE_LABELS[resume.template]}</p>
          <button
            type="button"
            onClick={() => cycleTemplate(1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Next template"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, Number((z - 0.1).toFixed(2))))}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Zoom out"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="text-sm w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, Number((z + 0.1).toFixed(2))))}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Zoom in"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button
            type="button"
            onClick={fitWidth}
            className="ml-2 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/10 transition-colors border border-white/20"
          >
            Fit Width
          </button>
          <button
            type="button"
            onClick={fitPage}
            className="px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/10 transition-colors border border-white/20"
          >
            Fit Page
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close preview"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto flex items-start justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={transition}
        >
          <div
            className="shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center", width: PAGE_WIDTH }}
          >
            <Template resume={resume} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

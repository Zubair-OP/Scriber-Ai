"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { TEMPLATE_COMPONENTS } from "@/components/builder/templates";
import { HealthRing } from "@/components/dashboard/HealthRing";
import { computeResumeHealth } from "@/lib/resume-health";
import { resumeToDraft } from "@/lib/resume-draft";
import { downloadResumePdfApi } from "@/apis/resume.api";
import type { IResume } from "@/types/resume.types";

function formatDate(value?: string | Date) {
  if (!value) return "Draft";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ResumeCardProps {
  resume: IResume;
  onDelete: (resumeId: string) => void;
  deleting: boolean;
}

export function ResumeCard({ resume, onDelete, deleting }: ResumeCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const reduceMotion = useReducedMotion();
  const Template = TEMPLATE_COMPONENTS[resume.template || "classic"];
  const draft = resumeToDraft(resume as unknown as Record<string, unknown>);
  const health = computeResumeHealth(resume);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resume.shareId) return;
    const url = `${window.location.origin}/resume/share/${resume.shareId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resume._id) return;
    setDownloading(true);
    setDownloadError(false);
    try {
      await downloadResumePdfApi(resume._id);
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      layout={!reduceMotion}
      initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-1.5 bg-white/50 backdrop-blur-sm rounded-[1.5rem] border border-surface-variant/40"
    >
      <div className="bg-white rounded-[1.25rem] border border-surface-variant/20 flex flex-col h-full overflow-hidden">
        <Link href={`/resume/${resume._id}`} className="block">
          <div className="relative h-56 bg-surface-subtle/40 overflow-hidden border-b border-surface-variant/20">
            <div className="absolute top-0 left-0 origin-top-left" style={{ transform: "scale(0.34)", width: "800px" }}>
              <Template resume={draft} />
            </div>
            <div className="absolute top-2.5 right-2.5">
              <HealthRing score={health.score} size={32} />
            </div>
            {resume.isPublic && (
              <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-emerald-600 text-white font-label-sm px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[13px]">public</span>
                Public
              </span>
            )}
          </div>
        </Link>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-headline-md text-on-surface truncate">
              {resume.title || resume.personalInfo?.fullname || "Untitled Resume"}
            </h3>
            <span className="font-label-sm text-on-surface-variant capitalize px-2 py-1 rounded-full bg-surface-variant/40 whitespace-nowrap">
              {resume.template || "classic"}
            </span>
          </div>
          <p className="font-label-sm text-on-surface-variant mb-5">Updated {formatDate(resume.updatedAt)}</p>

          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-2">
              <Link
                href={`/resume/${resume._id}`}
                className="flex-1 text-center bg-primary-container text-white font-label-lg py-2.5 rounded-full hover:bg-primary transition-colors"
              >
                Edit
              </Link>
              {resume.isPublic && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2.5 rounded-full border border-surface-variant text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors"
                  aria-label="Copy share link"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {copied ? "check" : "link"}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => resume._id && onDelete(resume._id)}
                disabled={deleting}
                className="px-3 py-2.5 rounded-full border border-surface-variant text-on-surface-variant hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                aria-label="Delete resume"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="w-full inline-flex items-center justify-center gap-1.5 border border-surface-variant text-on-surface-variant font-label-lg py-2.5 rounded-full hover:bg-surface-subtle transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>
            {downloadError && <p className="text-xs text-red-600 text-center">Could not generate the PDF.</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

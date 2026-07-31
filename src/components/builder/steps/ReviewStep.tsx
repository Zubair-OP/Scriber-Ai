"use client";

import { useMemo, useState } from "react";
import { getATSScoreApi } from "@/apis/ai.api";
import { downloadResumePdfApi, generateFinalResumeApi, toggleResumeShareApi } from "@/apis/resume.api";
import { AIActionButton } from "@/components/builder/AIActionButton";
import { DesignControls } from "@/components/builder/DesignControls";
import { TEMPLATE_COMPONENTS, TEMPLATE_LABELS } from "@/components/builder/templates";
import type { StepProps } from "@/components/builder/types";
import { HealthRing } from "@/components/dashboard/HealthRing";
import { computeResumeHealth } from "@/lib/resume-health";
import { RESUME_TEMPLATES } from "@/types/resume.types";

interface ShareState {
  isPublic: boolean;
  shareId?: string;
}

interface ReviewStepProps extends StepProps {
  resumeId: string;
  shareState: ShareState;
  onShareStateChange: (next: ShareState) => void;
}

function draftToPlainText(draft: StepProps["draft"]): string {
  const lines: string[] = [];
  lines.push(draft.personalInfo.fullname);
  lines.push(draft.summary);
  draft.workExperience.forEach((exp) => {
    lines.push(`${exp.position} at ${exp.company}: ${exp.description}`);
  });
  draft.projects.forEach((project) => {
    lines.push(`${project.title}: ${project.description}`);
  });
  draft.education.forEach((edu) => {
    lines.push(`${edu.degree} - ${edu.institute}`);
  });
  lines.push(`Skills: ${draft.skills.join(", ")}`);
  return lines.filter(Boolean).join("\n");
}

interface AtsResult {
  atsScore?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  recommendations?: string[];
}

export function ReviewStep({ draft, updateDraft, resumeId, shareState, onShareStateChange }: ReviewStepProps) {
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
  const [polishNotice, setPolishNotice] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = shareState.shareId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/resume/share/${shareState.shareId}`
    : "";

  const handleToggleShare = async () => {
    setSharing(true);
    try {
      const response = await toggleResumeShareApi(resumeId, !shareState.isPublic);
      onShareStateChange({
        isPublic: Boolean(response?.data?.isPublic),
        shareId: response?.data?.shareId,
      });
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resumeText = useMemo(() => draftToPlainText(draft), [draft]);
  const health = useMemo(() => computeResumeHealth(draft), [draft]);

  const handleCheckAtsScore = async () => {
    const response = await getATSScoreApi({ resumeText });
    setAtsResult(response?.data?.AtsScore || null);
  };

  const handlePolish = async () => {
    const confirmed = window.confirm(
      "This will overwrite your summary, experience, projects, education, skills, and certifications with an AI-polished version based on your last save. Any unsaved changes (including reordering) will be lost. Continue?"
    );
    if (!confirmed) return;

    setPolishNotice("");
    const response = await generateFinalResumeApi(resumeId);
    const polished = response?.data;
    if (!polished) return;

    updateDraft({
      summary: polished.summary ?? draft.summary,
      personalInfo: { ...draft.personalInfo, ...(polished.personalInfo || {}) },
      workExperience: polished.workExperience ?? draft.workExperience,
      projects: polished.projects ?? draft.projects,
      education: polished.education ?? draft.education,
      skills: polished.skills ?? draft.skills,
      certifications: polished.certifications ?? draft.certifications,
    });
    setPolishNotice("Resume polished with AI. Review the changes below before downloading.");
  };

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError("");
    try {
      await downloadResumePdfApi(resumeId);
    } catch {
      setDownloadError("Could not generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline-md text-on-surface mb-1">Template &amp; Review</h2>
        <p className="font-body-md text-on-surface-variant">
          Pick a layout, polish your content, and download your resume.
        </p>
      </div>

      <div>
        <p className="font-label-lg text-on-surface mb-3">Choose a template</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {RESUME_TEMPLATES.map((templateKey) => {
            const TemplatePreview = TEMPLATE_COMPONENTS[templateKey];
            const selected = draft.template === templateKey;
            return (
              <button
                key={templateKey}
                type="button"
                onClick={() => updateDraft({ template: templateKey })}
                className={`text-left rounded-2xl border-2 overflow-hidden transition-colors ${
                  selected ? "border-primary-container" : "border-surface-variant hover:border-primary-container/50"
                }`}
              >
                <div className="relative h-32 bg-white overflow-hidden">
                  <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{ transform: "scale(0.19)", width: "800px" }}
                  >
                    <TemplatePreview resume={draft} />
                  </div>
                </div>
                <p
                  className={`font-label-sm text-center py-2 ${
                    selected ? "bg-primary-container text-white" : "bg-surface-subtle text-on-surface-variant"
                  }`}
                >
                  {TEMPLATE_LABELS[templateKey]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-surface-variant bg-surface-subtle/40 space-y-3">
        <div className="flex items-center gap-3">
          <HealthRing score={health.score} size={44} />
          <div>
            <p className="font-label-lg text-on-surface">Resume completeness</p>
            <p className="font-body-sm text-on-surface-variant">A free, instant check of how filled-out your resume is.</p>
          </div>
        </div>
        <ul className="space-y-1.5">
          {health.sections
            .filter((section) => section.status !== "complete")
            .map((section) => (
              <li key={section.key} className="flex items-start gap-2 text-sm text-on-surface-variant">
                <span
                  className={`material-symbols-outlined text-[16px] mt-0.5 ${
                    section.status === "missing" ? "text-red-500" : "text-amber-500"
                  }`}
                >
                  {section.status === "missing" ? "error" : "info"}
                </span>
                <span>
                  <span className="font-medium text-on-surface">{section.label}:</span> {section.message}
                </span>
              </li>
            ))}
          {health.sections.every((section) => section.status === "complete") && (
            <li className="flex items-center gap-2 text-sm text-emerald-700">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Every section is filled out.
            </li>
          )}
        </ul>
      </div>

      <div className="p-5 rounded-2xl border border-surface-variant bg-surface-subtle/40 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="font-label-lg text-on-surface">Share this resume</p>
            <p className="font-body-sm text-on-surface-variant">
              {shareState.isPublic
                ? "Anyone with the link can view a read-only copy of this resume."
                : "Turn this on to get a public link anyone can view without signing in."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleShare}
            disabled={sharing}
            className={`px-4 py-2 rounded-full font-label-sm transition-colors disabled:opacity-50 ${
              shareState.isPublic
                ? "bg-primary-container text-white hover:bg-primary"
                : "border border-surface-variant text-on-surface-variant hover:bg-surface-subtle"
            }`}
          >
            {sharing ? "Updating..." : shareState.isPublic ? "Public" : "Make public"}
          </button>
        </div>
        {shareState.isPublic && shareUrl && (
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 rounded-xl border border-surface-variant bg-white text-sm text-on-surface-variant"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl border border-surface-variant font-label-sm hover:bg-surface-subtle transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <div className="lg:hidden">
        <p className="font-label-lg text-on-surface mb-3">Color &amp; typography</p>
        <DesignControls
          colorTheme={draft.colorTheme}
          typographyTheme={draft.typographyTheme}
          onColorChange={(colorTheme) => updateDraft({ colorTheme })}
          onTypographyChange={(typographyTheme) => updateDraft({ typographyTheme })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <AIActionButton label="Check ATS score" onRun={handleCheckAtsScore} />
        <AIActionButton label="Polish entire resume with AI" onRun={handlePolish} />
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 bg-primary-container text-white font-label-sm px-4 py-2 rounded-full hover:bg-primary transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          {downloading ? "Generating PDF..." : "Download PDF"}
        </button>
        {downloadError && <span className="text-xs text-red-600">{downloadError}</span>}
      </div>

      {polishNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
          {polishNotice}
        </div>
      )}

      {atsResult && (
        <div className="p-5 rounded-2xl border border-surface-variant bg-surface-subtle/40 space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-display-lg text-primary-container">{atsResult.atsScore ?? "-"}</span>
            <span className="font-body-md text-on-surface-variant">ATS Score</span>
          </div>
          {atsResult.summary && <p className="font-body-md text-on-surface">{atsResult.summary}</p>}
          {atsResult.strengths && atsResult.strengths.length > 0 && (
            <div>
              <p className="font-label-lg text-on-surface mb-1">Strengths</p>
              <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-0.5">
                {atsResult.strengths.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {atsResult.improvements && atsResult.improvements.length > 0 && (
            <div>
              <p className="font-label-lg text-on-surface mb-1">Areas for improvement</p>
              <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-0.5">
                {atsResult.improvements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {atsResult.recommendations && atsResult.recommendations.length > 0 && (
            <div>
              <p className="font-label-lg text-on-surface mb-1">Recommendations</p>
              <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-0.5">
                {atsResult.recommendations.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

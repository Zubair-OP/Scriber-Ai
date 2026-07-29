"use client";

import { useMemo, useState } from "react";
import { getATSScoreApi } from "@/apis/ai.api";
import { downloadResumePdfApi, generateFinalResumeApi } from "@/apis/resume.api";
import { AIActionButton } from "@/components/builder/AIActionButton";
import { TEMPLATE_COMPONENTS, TEMPLATE_LABELS } from "@/components/builder/templates";
import type { StepProps } from "@/components/builder/types";
import { RESUME_TEMPLATES } from "@/types/resume.types";

interface ReviewStepProps extends StepProps {
  resumeId: string;
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

export function ReviewStep({ draft, updateDraft, resumeId }: ReviewStepProps) {
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
  const [polishNotice, setPolishNotice] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const SelectedTemplate = TEMPLATE_COMPONENTS[draft.template];

  const resumeText = useMemo(() => draftToPlainText(draft), [draft]);

  const handleCheckAtsScore = async () => {
    const response = await getATSScoreApi({ resumeText });
    setAtsResult(response?.data?.AtsScore || null);
  };

  const handlePolish = async () => {
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
        </div>
      )}

      <div>
        <p className="font-label-lg text-on-surface mb-3">Live preview</p>
        <div className="rounded-2xl border border-surface-variant overflow-auto bg-surface-subtle/40 p-4">
          <div className="shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <SelectedTemplate resume={draft} />
          </div>
        </div>
      </div>
    </div>
  );
}

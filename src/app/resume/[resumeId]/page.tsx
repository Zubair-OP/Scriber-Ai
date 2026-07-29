"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/home/sections/site-header";
import { useSession } from "@/hooks/useSession";
import { getResumeByIdApi, updateResumeApi } from "@/apis/resume.api";
import { emptyDraft, type ResumeDraft } from "@/components/builder/types";
import { resumeToDraft } from "@/lib/resume-draft";
import { PersonalInfoStep } from "@/components/builder/steps/PersonalInfoStep";
import { SummaryStep } from "@/components/builder/steps/SummaryStep";
import { WorkExperienceStep } from "@/components/builder/steps/WorkExperienceStep";
import { EducationStep } from "@/components/builder/steps/EducationStep";
import { ProjectsStep } from "@/components/builder/steps/ProjectsStep";
import { SkillsStep } from "@/components/builder/steps/SkillsStep";
import { CertificationsStep } from "@/components/builder/steps/CertificationsStep";
import { ReviewStep } from "@/components/builder/steps/ReviewStep";

const STEPS = [
  { key: "personal", label: "Personal Info" },
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "certifications", label: "Certifications" },
  { key: "review", label: "Template & Review" },
] as const;

export default function ResumeBuilderPage() {
  const router = useRouter();
  const params = useParams<{ resumeId: string }>();
  const resumeId = params.resumeId;
  const { user, loading: sessionLoading } = useSession();

  const [draft, setDraft] = useState<ResumeDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login");
    }
  }, [sessionLoading, user, router]);

  useEffect(() => {
    if (!user || !resumeId) return;

    (async () => {
      try {
        const response = await getResumeByIdApi(resumeId);
        setDraft(resumeToDraft(response?.data || {}));
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, resumeId]);

  const updateDraft = useCallback((patch: Partial<ResumeDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const persist = async (): Promise<boolean> => {
    setSaving(true);
    setError("");
    try {
      await updateResumeApi(resumeId, draft as unknown as Record<string, unknown>);
      return true;
    } catch {
      setError("Could not save your changes. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const goToStep = async (nextIndex: number) => {
    const saved = await persist();
    if (saved) {
      setStepIndex(nextIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (sessionLoading || !user || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface">
        <SiteHeader />
        <main className="flex-grow flex items-center justify-center pt-32">
          <p className="font-body-md text-on-surface-variant">Loading...</p>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface">
        <SiteHeader />
        <main className="flex-grow flex flex-col items-center justify-center pt-32 gap-4">
          <p className="font-headline-md text-on-surface">Resume not found</p>
          <Link href="/dashboard" className="text-primary-container font-label-lg hover:text-primary">
            Back to dashboard
          </Link>
        </main>
      </div>
    );
  }

  const stepProps = { draft, updateDraft };
  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow pt-28 pb-24 px-4 md:px-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Stepper */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, index) => (
              <button
                key={step.key}
                type="button"
                onClick={() => goToStep(index)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-label-sm transition-colors ${
                  index === stepIndex
                    ? "bg-primary-container text-white"
                    : index < stepIndex
                    ? "bg-primary/10 text-primary"
                    : "bg-surface-variant/40 text-on-surface-variant"
                }`}
              >
                {index + 1}. {step.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="bg-white rounded-[1.5rem] border border-surface-variant/60 p-6 sm:p-10">
            {stepIndex === 0 && <PersonalInfoStep {...stepProps} />}
            {stepIndex === 1 && <SummaryStep {...stepProps} />}
            {stepIndex === 2 && <WorkExperienceStep {...stepProps} />}
            {stepIndex === 3 && <EducationStep {...stepProps} />}
            {stepIndex === 4 && <ProjectsStep {...stepProps} />}
            {stepIndex === 5 && <SkillsStep {...stepProps} />}
            {stepIndex === 6 && <CertificationsStep {...stepProps} />}
            {stepIndex === 7 && <ReviewStep {...stepProps} resumeId={resumeId} />}

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToStep(Math.max(0, stepIndex - 1))}
                disabled={stepIndex === 0 || saving}
                className="px-5 py-2.5 rounded-full border border-surface-variant text-on-surface-variant font-label-lg hover:bg-surface-subtle transition-colors disabled:opacity-40"
              >
                Back
              </button>

              {isLastStep ? (
                <button
                  type="button"
                  onClick={persist}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-primary-container text-white font-label-lg hover:bg-primary transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goToStep(stepIndex + 1)}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-primary-container text-white font-label-lg hover:bg-primary transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save & Continue"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

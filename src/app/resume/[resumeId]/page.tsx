"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SiteHeader } from "@/components/home/sections/site-header";
import { useSession } from "@/hooks/useSession";
import { getResumeByIdApi, updateResumeApi } from "@/apis/resume.api";
import { emptyDraft, type ResumeDraft } from "@/components/builder/types";
import { resumeToDraft } from "@/lib/resume-draft";
import { TEMPLATE_COMPONENTS } from "@/components/builder/templates";
import { FullscreenPreviewModal } from "@/components/builder/FullscreenPreviewModal";
import { BuilderSkeleton } from "@/components/ui/Skeleton";
import { DesignControls } from "@/components/builder/DesignControls";
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
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [shareState, setShareState] = useState<{ isPublic: boolean; shareId?: string }>({ isPublic: false });
  const reduceMotion = useReducedMotion();

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
        setShareState({
          isPublic: Boolean(response?.data?.isPublic),
          shareId: response?.data?.shareId,
        });
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

  const handleSaveAndRedirect = async () => {
    const saved = await persist();
    if (saved) {
      router.push("/dashboard");
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
        <main className="flex-grow pb-24">
          <BuilderSkeleton />
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
  const SelectedTemplate = TEMPLATE_COMPONENTS[draft.template];

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

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px] gap-6 items-start">
            <div className="bg-white rounded-[1.5rem] border border-surface-variant/60 p-6 sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                >
                  {stepIndex === 0 && <PersonalInfoStep {...stepProps} />}
                  {stepIndex === 1 && <SummaryStep {...stepProps} />}
                  {stepIndex === 2 && <WorkExperienceStep {...stepProps} />}
                  {stepIndex === 3 && <EducationStep {...stepProps} />}
                  {stepIndex === 4 && <ProjectsStep {...stepProps} />}
                  {stepIndex === 5 && <SkillsStep {...stepProps} />}
                  {stepIndex === 6 && <CertificationsStep {...stepProps} />}
                  {stepIndex === 7 && (
                    <ReviewStep
                      {...stepProps}
                      resumeId={resumeId}
                      shareState={shareState}
                      onShareStateChange={setShareState}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

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
                    onClick={handleSaveAndRedirect}
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

            <div className="hidden lg:flex lg:sticky lg:top-24 flex-col gap-3 bg-white rounded-[1.5rem] border border-surface-variant/60 p-4">
              <div className="flex items-center justify-between px-1">
                <p className="font-label-lg text-on-surface">Live preview</p>
                <button
                  type="button"
                  onClick={() => setFullscreenOpen(true)}
                  className="inline-flex items-center gap-1 text-primary-container font-label-sm hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                  Preview
                </button>
              </div>
              <DesignControls
                colorTheme={draft.colorTheme}
                typographyTheme={draft.typographyTheme}
                onColorChange={(colorTheme) => updateDraft({ colorTheme })}
                onTypographyChange={(typographyTheme) => updateDraft({ typographyTheme })}
                className="px-1"
              />
              <div
                className="overflow-auto rounded-xl bg-surface-subtle/40 p-4"
                style={{ maxHeight: "calc(100vh - 220px)" }}
              >
                <div
                  className="shadow-[0_10px_40px_rgba(0,0,0,0.08)] origin-top-left"
                  style={{ transform: "scale(0.62)", width: "800px" }}
                >
                  <SelectedTemplate resume={draft} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FullscreenPreviewModal
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        resume={draft}
        onTemplateChange={(template) => updateDraft({ template })}
      />
    </div>
  );
}

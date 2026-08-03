"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { useSession } from "@/hooks/useSession";
import {
  createResumeApi,
  deleteResumeApi,
  getAllResumesApi,
} from "@/apis/resume.api";
import type { IResume } from "@/types/resume.types";
import { getResumeLimit } from "@/lib/plan-limits";

type SortOption = "updated" | "title";

function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: sessionLoading } = useSession();

  const [resumes, setResumes] = useState<IResume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [showWelcome, setShowWelcome] = useState(() => searchParams.get("welcome") === "1");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login");
    }
  }, [sessionLoading, user, router]);

  const dismissWelcome = () => {
    setShowWelcome(false);
    router.replace("/dashboard");
  };

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const response = await getAllResumesApi();
        setResumes(response?.data || []);
      } catch {
        setError("Could not load your resumes. Please refresh the page.");
      } finally {
        setLoadingResumes(false);
      }
    })();
  }, [user]);

  const resumeLimit = getResumeLimit(user?.plan);
  const atResumeLimit = Number.isFinite(resumeLimit) && resumes.length >= resumeLimit;

  const visibleResumes = useMemo(() => {
    const filtered = query.trim()
      ? resumes.filter((resume) => {
          const label = `${resume.title || ""} ${resume.personalInfo?.fullname || ""}`.toLowerCase();
          return label.includes(query.trim().toLowerCase());
        })
      : resumes;

    const sorted = [...filtered];
    if (sortBy === "title") {
      sorted.sort((a, b) =>
        (a.title || a.personalInfo?.fullname || "Untitled Resume").localeCompare(
          b.title || b.personalInfo?.fullname || "Untitled Resume"
        )
      );
    } else {
      sorted.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    }
    return sorted;
  }, [resumes, query, sortBy]);

  const handleCreate = async () => {
    setError("");
    setCreating(true);

    try {
      const response = await createResumeApi();
      const newResume = response?.data;
      router.push(`/resume/${newResume._id}`);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const resErr = err as { response?: { data?: { message?: string } } };
        setError(resErr.response?.data?.message || "Could not create a new resume.");
      } else {
        setError("Could not create a new resume.");
      }
      setCreating(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    setDeletingId(resumeId);
    try {
      await deleteResumeApi(resumeId);
      setResumes((prev) => prev.filter((resume) => resume._id !== resumeId));
    } catch {
      setError("Could not delete that resume.");
    } finally {
      setDeletingId(null);
    }
  };

  if (sessionLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface">
        <SiteHeader />
        <main className="flex-grow flex items-center justify-center pt-32">
          <p className="font-body-md text-on-surface-variant">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow">
        <section className="pt-32 pb-10 px-4 md:px-10 max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10 capitalize">
                {user.plan || "free"} plan
              </span>
              <h1 className="font-display-lg text-on-surface">
                Welcome back, {user.name.split(" ")[0]}
              </h1>
              <p className="font-body-lg text-on-surface-variant mt-2">
                Manage your resumes or start a new one.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || atResumeLimit}
              className="inline-flex items-center justify-center gap-2 bg-primary-container text-white font-title-md px-6 py-3 rounded-full hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              {creating ? "Creating..." : "New Resume"}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          {showWelcome && (
            <div className="mt-6 p-6 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-headline-sm text-on-surface mb-1">Welcome to Scriber AI</p>
                <p className="font-body-md text-on-surface-variant">
                  Ready when you are — browse a template for inspiration, or start with a blank resume.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/templates"
                  onClick={dismissWelcome}
                  className="inline-flex items-center justify-center border border-surface-variant text-on-surface font-label-lg px-5 py-2.5 rounded-full hover:bg-surface-subtle transition-colors whitespace-nowrap"
                >
                  Browse templates
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    dismissWelcome();
                    handleCreate();
                  }}
                  className="inline-flex items-center justify-center bg-primary-container text-white font-label-lg px-5 py-2.5 rounded-full hover:bg-primary transition-colors whitespace-nowrap"
                >
                  Start from scratch
                </button>
              </div>
            </div>
          )}

          {Number.isFinite(resumeLimit) && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-label-sm text-on-surface-variant">
                  {resumes.length} of {resumeLimit} resumes used
                </p>
              </div>
              <div className="h-1.5 rounded-full bg-surface-variant/40 overflow-hidden">
                <div
                  className="h-full bg-primary-container transition-all"
                  style={{ width: `${Math.min(100, (resumes.length / resumeLimit) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {atResumeLimit && (
            <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="font-body-md text-on-surface">
                {user.plan === "pro"
                  ? "Pro plan is limited to 5 resumes. Upgrade to Enterprise for unlimited resumes."
                  : "Free plan is limited to 1 resume. Upgrade to Pro for up to 5 resumes or Enterprise for unlimited."}
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center bg-primary-container text-white font-label-lg px-5 py-2.5 rounded-full hover:bg-primary transition-colors whitespace-nowrap"
              >
                {user.plan === "pro" ? "Upgrade to Enterprise" : "Upgrade to Pro"}
              </Link>
            </div>
          )}
        </section>

        <section className="px-4 md:px-10 max-w-[1200px] mx-auto pb-24">
          {loadingResumes ? (
            <DashboardSkeleton />
          ) : resumes.length === 0 ? (
            <div className="rounded-[1.25rem] border border-dashed border-surface-variant p-16 text-center">
              <p className="font-headline-md text-on-surface mb-2">No resumes yet</p>
              <p className="font-body-md text-on-surface-variant mb-6">
                Create your first resume to get started.
              </p>
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className="inline-flex items-center gap-2 bg-primary-container text-white font-title-md px-6 py-3 rounded-full hover:bg-primary transition-colors disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create your first resume"}
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2">
                    search
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your resumes"
                    className="w-full pl-10 pr-4 py-2.5 border border-surface-variant rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2.5 border border-surface-variant rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/30"
                >
                  <option value="updated">Recently updated</option>
                  <option value="title">Title A–Z</option>
                </select>
              </div>

              {visibleResumes.length === 0 ? (
                <p className="font-body-md text-on-surface-variant">No resumes match your search.</p>
              ) : (
                <motion.div layout={!reduceMotion} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {visibleResumes.map((resume) => (
                      <ResumeCard
                        key={resume._id}
                        resume={resume}
                        onDelete={handleDelete}
                        deleting={deletingId === resume._id}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function DashboardPageWrapper() {
  return (
    <Suspense fallback={null}>
      <DashboardPage />
    </Suspense>
  );
}

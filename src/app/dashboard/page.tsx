"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";
import { useSession } from "@/hooks/useSession";
import {
  createResumeApi,
  deleteResumeApi,
  getAllResumesApi,
} from "@/apis/resume.api";
import type { IResume } from "@/types/resume.types";
import { getResumeLimit } from "@/lib/plan-limits";

function formatDate(value?: string | Date) {
  if (!value) return "Draft";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: sessionLoading } = useSession();

  const [resumes, setResumes] = useState<IResume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login");
    }
  }, [sessionLoading, user, router]);

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

          {atResumeLimit && (
            <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="font-body-md text-on-surface">
                {user.plan === "pro"
                  ? "Pro plan is limited to 5 resumes. Contact sales about Enterprise for unlimited resumes."
                  : "Free plan is limited to 1 resume. Upgrade to Pro for up to 5 resumes and AI assistance."}
              </p>
              {user.plan === "pro" ? (
                <a
                  href="mailto:sales@scriberbuilder.com"
                  className="inline-flex items-center justify-center bg-primary-container text-white font-label-lg px-5 py-2.5 rounded-full hover:bg-primary transition-colors whitespace-nowrap"
                >
                  Contact Sales
                </a>
              ) : (
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center bg-primary-container text-white font-label-lg px-5 py-2.5 rounded-full hover:bg-primary transition-colors whitespace-nowrap"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          )}
        </section>

        <section className="px-4 md:px-10 max-w-[1200px] mx-auto pb-24">
          {loadingResumes ? (
            <p className="font-body-md text-on-surface-variant">Loading your resumes...</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="p-1.5 bg-white/50 backdrop-blur-sm rounded-[1.5rem] border border-surface-variant/40"
                >
                  <div className="bg-white rounded-[1.25rem] p-6 border border-surface-variant/20 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <span className="material-symbols-outlined text-primary-container text-[28px]">
                        description
                      </span>
                      <span className="font-label-sm text-on-surface-variant capitalize px-2 py-1 rounded-full bg-surface-variant/40">
                        {resume.template || "classic"}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-on-surface mb-1 truncate">
                      {resume.title || resume.personalInfo?.fullname || "Untitled Resume"}
                    </h3>
                    <p className="font-label-sm text-on-surface-variant mb-6">
                      Updated {formatDate(resume.updatedAt)}
                    </p>

                    <div className="mt-auto flex items-center gap-2">
                      <Link
                        href={`/resume/${resume._id}`}
                        className="flex-1 text-center bg-primary-container text-white font-label-lg py-2.5 rounded-full hover:bg-primary transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => resume._id && handleDelete(resume._id)}
                        disabled={deletingId === resume._id}
                        className="px-3 py-2.5 rounded-full border border-surface-variant text-on-surface-variant hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                        aria-label="Delete resume"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

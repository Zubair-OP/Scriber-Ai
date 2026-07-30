"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/home/sections/site-header";
import { useSession } from "@/hooks/useSession";
import { createResumeApi } from "@/apis/resume.api";
import { sanitizeTemplateInput } from "@/lib/resume-validation";

function NewResumeRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useSession();
  const started = useRef(false);

  const template = sanitizeTemplateInput(searchParams.get("template"));

  useEffect(() => {
    if (loading || started.current) return;

    if (!user) {
      const query = template ? `?template=${template}` : "";
      router.replace(`/signup${query}`);
      return;
    }

    started.current = true;

    (async () => {
      try {
        const response = await createResumeApi(template);
        const newResume = response?.data;
        router.replace(`/resume/${newResume._id}`);
      } catch {
        router.replace("/dashboard");
      }
    })();
  }, [loading, user, template, router]);

  return <p className="font-body-md text-on-surface-variant">Setting up your resume...</p>;
}

export default function NewResumePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center pt-32">
        <Suspense fallback={<p className="font-body-md text-on-surface-variant">Loading...</p>}>
          <NewResumeRedirect />
        </Suspense>
      </main>
    </div>
  );
}

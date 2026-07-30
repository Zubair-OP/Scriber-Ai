"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";
import { FullscreenPreviewModal } from "@/components/builder/FullscreenPreviewModal";
import { TEMPLATE_COMPONENTS } from "@/components/builder/templates";
import { SAMPLE_RESUME_DRAFT } from "@/components/builder/templates/sample-data";
import { TEMPLATE_METADATA_LIST } from "@/lib/template-metadata";
import type { ResumeTemplate } from "@/types/resume.types";

export default function TemplatesPage() {
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  const previewResume = previewTemplate
    ? { ...SAMPLE_RESUME_DRAFT, template: previewTemplate }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow">
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4 md:px-10">
          <div className="max-w-[1200px] mx-auto text-center">
            <span className="inline-flex items-center px-3 py-1 mb-4 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
              Templates
            </span>
            <h1 className="font-display-lg text-on-surface mb-4">
              Choose Your Resume Template
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Every template below is exactly what you&apos;ll get in the builder — pick one and start
              writing immediately.
            </p>
          </div>
        </section>

        <section className="pb-24 px-4 md:px-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {TEMPLATE_METADATA_LIST.map((meta) => {
                const TemplateComponent = TEMPLATE_COMPONENTS[meta.key];
                return (
                  <div
                    key={meta.key}
                    className="group rounded-[1.5rem] border border-surface-variant/60 bg-white p-3 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:border-primary-container/40"
                  >
                    <div className="relative aspect-[800/930] overflow-hidden rounded-[1.1rem] bg-surface-subtle">
                      <div
                        className="pointer-events-none absolute top-0 left-0 origin-top-left transition-transform duration-500 group-hover:scale-[1.03]"
                        style={{ transform: "scale(0.4)", width: "800px" }}
                      >
                        <TemplateComponent resume={SAMPLE_RESUME_DRAFT} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 bg-slate-950/0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-slate-950/50 group-hover:backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={() => setPreviewTemplate(meta.key)}
                          className="bg-white/95 text-on-surface font-label-lg px-4 py-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          Preview
                        </button>
                        <Link
                          href={`/resume/new?template=${meta.key}`}
                          className="bg-primary-container hover:bg-primary text-white font-label-lg px-4 py-2.5 rounded-full shadow-lg transition-colors"
                        >
                          Use Template
                        </Link>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-headline-md text-on-surface">{meta.label}</h3>
                        {meta.atsFriendly && (
                          <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${meta.accent.bg} ${meta.accent.text}`}>
                            ATS Friendly
                          </span>
                        )}
                      </div>
                      <p className="font-label-sm text-on-surface-variant mt-1">{meta.tagline}</p>
                      <p className="font-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        {meta.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {meta.recommendedFor.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-surface-subtle px-2.5 py-1 text-[11px] text-on-surface-variant"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <FullscreenPreviewModal
        open={previewResume !== null}
        onClose={() => setPreviewTemplate(null)}
        resume={previewResume ?? SAMPLE_RESUME_DRAFT}
        onTemplateChange={(template) => setPreviewTemplate(template)}
      />
    </div>
  );
}

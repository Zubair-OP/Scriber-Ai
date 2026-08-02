"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";

export interface LegalSection {
  id: string;
  title: string;
  content: string[];
}

interface LegalPageClientProps {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  lastUpdatedIso: string;
  sections: LegalSection[];
  headerExtra?: React.ReactNode;
  footerLinks?: React.ReactNode;
}

/** Converts **bold** markdown syntax to <strong> inline */
function RichParagraph({ text }: { text: string }) {
  if (!text.includes("**")) {
    return (
      <p className="font-body-lg text-on-surface-variant leading-relaxed">{text}</p>
    );
  }
  return (
    <p
      className="font-body-lg text-on-surface-variant leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: text.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="text-on-surface font-semibold">$1</strong>'
        ),
      }}
    />
  );
}

export function LegalPageClient({
  badge,
  title,
  subtitle,
  lastUpdated,
  lastUpdatedIso,
  sections,
  headerExtra,
  footerLinks,
}: LegalPageClientProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const tocRef = useRef<HTMLUListElement>(null);

  /* ─────────────────────────────────────────────────────────────
     Scroll-based active section tracker.
     On every scroll tick we loop through all section headings and
     mark the LAST one whose top edge is at or above 120 px from
     the viewport top. 120 px accounts for the sticky header.
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const THRESHOLD = 120; // px below viewport top

    const update = () => {
      let current = sections[0]?.id ?? "";

      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= THRESHOLD) current = id;
      }

      setActiveId(current);
    };

    window.addEventListener("scroll", update, { passive: true });
    update(); // run once on mount

    return () => window.removeEventListener("scroll", update);
  }, [sections]);

  /* ─────────────────────────────────────────────────────────────
     Whenever activeId changes, scroll the active ToC link into
     view inside the sticky sidebar (so long lists stay navigable).
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!tocRef.current) return;
    const activeEl = tocRef.current.querySelector(
      `[data-toc-id="${activeId}"]`
    ) as HTMLElement | null;
    activeEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  const activeIndex = sections.findIndex((s) => s.id === activeId);
  const progress =
    sections.length > 0 ? ((activeIndex + 1) / sections.length) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow">
        {/* ── Hero ── */}
        <section className="pt-32 pb-12 px-4 md:px-10 bg-surface border-b border-surface-variant">
          <div className="max-w-[760px] mx-auto">
            <span className="inline-flex items-center px-3 py-1 mb-5 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
              {badge}
            </span>
            <h1 className="font-display-lg text-on-surface mb-4">{title}</h1>
            <p className="font-body-lg text-on-surface-variant">
              Last updated:{" "}
              <time dateTime={lastUpdatedIso}>{lastUpdated}</time>
            </p>
            <p className="font-body-md text-on-surface-variant mt-3">{subtitle}</p>
            {headerExtra && <div className="mt-6">{headerExtra}</div>}
          </div>
        </section>

        {/* ── Two-column layout ── */}
        <div className="py-16 px-4 md:px-10">
          <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12">

            {/* ── Sticky Table of Contents ── */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">

                {/* Header + progress */}
                <div className="mb-3 pb-3 border-b border-surface-variant">
                  <p className="font-label-lg text-on-surface mb-2">On this page</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow h-1.5 bg-surface-dim rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="font-label-sm text-on-surface-variant tabular-nums whitespace-nowrap">
                      {activeIndex + 1}&nbsp;/&nbsp;{sections.length}
                    </span>
                  </div>
                </div>

                {/* ToC links */}
                <nav aria-label={`${title} sections`}>
                  <ul ref={tocRef} className="space-y-0.5">
                    {sections.map((s) => {
                      const isActive = activeId === s.id;
                      return (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            data-toc-id={s.id}
                            aria-current={isActive ? "location" : undefined}
                            className={[
                              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 leading-snug select-none",
                              isActive
                                ? /* ── ACTIVE STATE ── solid green-tinted chip */
                                  "bg-primary/10 text-primary font-semibold border-l-4 border-primary-container pl-2"
                                : /* ── INACTIVE ── muted, shows hover */
                                  "text-on-surface-variant border-l-4 border-transparent hover:text-on-surface hover:bg-surface-container hover:border-surface-dim",
                            ].join(" ")}
                          >
                            {/* Active dot */}
                            <span
                              className={[
                                "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-200",
                                isActive
                                  ? "bg-primary-container scale-125"
                                  : "bg-outline/30",
                              ].join(" ")}
                            />
                            {s.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* ── Main article ── */}
            <article className="flex-grow max-w-[720px]">
              <div className="divide-y divide-surface-variant">
                {sections.map((s, idx) => {
                  const isActive = activeId === s.id;
                  return (
                    <section
                      key={s.id}
                      id={s.id}
                      className={[
                        "scroll-mt-28 transition-colors duration-300",
                        idx === 0 ? "pb-10" : "py-10",
                      ].join(" ")}
                    >
                      {/* Section heading row */}
                      <div className="flex items-start gap-3 mb-5">
                        {/* Active indicator stripe */}
                        <div
                          className={[
                            "mt-1 w-1 self-stretch rounded-full flex-shrink-0 transition-all duration-300",
                            isActive ? "bg-primary-container" : "bg-transparent",
                          ].join(" ")}
                        />

                        <div className="flex-grow">
                          <div className="flex items-center gap-2 group">
                            <h2
                              className={[
                                "font-headline-md transition-colors duration-200",
                                isActive
                                  ? "text-primary"
                                  : "text-on-surface",
                              ].join(" ")}
                            >
                              {s.title}
                            </h2>
                            {/* Anchor link — visible on hover */}
                            <a
                              href={`#${s.id}`}
                              aria-label={`Link to section: ${s.title}`}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant/50 hover:text-primary"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                link
                              </span>
                            </a>
                          </div>

                          {/* Active section gets a subtle tinted pill label */}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/8 text-primary rounded-full font-label-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-container inline-block" />
                              Currently reading
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Section content */}
                      <div
                        className={[
                          "pl-4 space-y-4 transition-all duration-300",
                          isActive
                            ? "border-l-2 border-primary-container/40"
                            : "border-l-2 border-transparent",
                        ].join(" ")}
                      >
                        {s.content.map((para, i) => (
                          <RichParagraph key={i} text={para} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>

              {/* Footer links */}
              {footerLinks && (
                <div className="mt-10 pt-8 border-t border-surface-variant space-y-3">
                  {footerLinks}
                </div>
              )}
            </article>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

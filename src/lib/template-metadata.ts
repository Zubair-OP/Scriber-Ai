import { RESUME_TEMPLATES, type ResumeTemplate } from "@/types/resume.types";

export interface TemplateAccent {
  text: string;
  bg: string;
  bar: string;
}

export type TemplateLayoutVariant = "single-column" | "sidebar-left" | "editorial";

export interface TemplateMeta {
  key: ResumeTemplate;
  label: string;
  tagline: string;
  description: string;
  atsFriendly: boolean;
  recommendedFor: string[];
  layout: TemplateLayoutVariant;
  accent: TemplateAccent;
}

export const TEMPLATE_METADATA: Record<ResumeTemplate, TemplateMeta> = {
  classic: {
    key: "classic",
    label: "Classic",
    tagline: "Traditional & ATS-optimized",
    description: "A clean, no-frills layout that puts your experience front and center. Built to sail through applicant tracking systems.",
    atsFriendly: true,
    recommendedFor: ["Corporate & Finance", "Traditional industries", "First resume"],
    layout: "single-column",
    accent: { text: "text-slate-700", bg: "bg-slate-100", bar: "bg-slate-700" },
  },
  formal: {
    key: "formal",
    label: "Formal",
    tagline: "Elegant & corporate",
    description: "Polished typography and a refined header treatment for professionals who want to look established and dependable.",
    atsFriendly: true,
    recommendedFor: ["Management", "Consulting", "Legal & Corporate"],
    layout: "single-column",
    accent: { text: "text-indigo-700", bg: "bg-indigo-50", bar: "bg-indigo-600" },
  },
  creative: {
    key: "creative",
    label: "Creative",
    tagline: "Modern & expressive",
    description: "A confident, accent-colored layout with a distinct header and chip-style skills — built for designers and modern brands.",
    atsFriendly: true,
    recommendedFor: ["Design", "Marketing", "Media & Content"],
    layout: "single-column",
    accent: { text: "text-fuchsia-700", bg: "bg-fuchsia-50", bar: "bg-fuchsia-600" },
  },
  capability: {
    key: "capability",
    label: "Capability",
    tagline: "Developer-focused",
    description: "A sidebar layout that puts skills and projects up front — built for engineers who want their tech stack seen immediately.",
    atsFriendly: true,
    recommendedFor: ["Software Engineering", "Data & DevOps", "Technical roles"],
    layout: "sidebar-left",
    accent: { text: "text-sky-700", bg: "bg-sky-50", bar: "bg-sky-600" },
  },
  precision: {
    key: "precision",
    label: "Precision",
    tagline: "Executive & structured",
    description: "A highly structured, minimalist layout with a centered header — built for leadership and senior-level roles.",
    atsFriendly: true,
    recommendedFor: ["Executive", "Operations", "Senior leadership"],
    layout: "single-column",
    accent: { text: "text-amber-700", bg: "bg-amber-50", bar: "bg-amber-600" },
  },
  purity: {
    key: "purity",
    label: "Purity",
    tagline: "Luxury & editorial",
    description: "Generous whitespace and an editorial, magazine-style hierarchy — a quietly confident layout for standout candidates.",
    atsFriendly: true,
    recommendedFor: ["Luxury & Hospitality", "Editorial & Publishing", "Senior creative roles"],
    layout: "editorial",
    accent: { text: "text-stone-700", bg: "bg-stone-100", bar: "bg-stone-700" },
  },
};

export const TEMPLATE_METADATA_LIST: TemplateMeta[] = RESUME_TEMPLATES.map(
  (key) => TEMPLATE_METADATA[key]
);

import type {
  ResumeColorTheme,
  ResumeTemplate,
  ResumeTypographyTheme,
} from "@/types/resume.types";

export interface TemplateTheme {
  pageClass: string;
  headingClass: string;
  dividerClass: string;
  nameClass: string;
  taglineClass: string;
  bodyClass: string;
  metaClass: string;
  accentClass: string;
  chipClass: string;
  sectionGap: string;
}

/**
 * Each template's exact shipped look. Used verbatim whenever colorTheme is
 * "default" — never decomposed/recomposed, so the default appearance can
 * never drift from what shipped.
 */
export const TEMPLATE_THEMES: Record<ResumeTemplate, TemplateTheme> = {
  classic: {
    pageClass: "bg-white text-gray-900 w-full max-w-[800px] mx-auto p-10 sm:p-12 print:p-0 font-sans text-sm",
    headingClass: "text-xs font-bold uppercase tracking-wider text-gray-800",
    dividerClass: "border-t border-gray-200",
    nameClass: "text-2xl font-bold text-gray-900",
    taglineClass: "text-sm text-gray-500 mt-0.5",
    bodyClass: "text-[13px] leading-6 text-gray-600",
    metaClass: "text-[11px] text-gray-400",
    accentClass: "text-gray-900",
    chipClass: "bg-slate-100 text-slate-700",
    sectionGap: "space-y-4",
  },
  formal: {
    pageClass: "bg-white text-slate-900 w-full max-w-[800px] mx-auto p-10 sm:p-12 print:p-0 font-sans text-sm",
    headingClass: "text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-900",
    dividerClass: "border-t border-slate-200",
    nameClass: "text-[26px] font-semibold tracking-tight text-slate-900",
    taglineClass: "text-sm font-medium text-indigo-700 mt-0.5",
    bodyClass: "text-[13px] leading-7 text-slate-600",
    metaClass: "text-[11px] text-slate-400",
    accentClass: "text-indigo-700",
    chipClass: "bg-indigo-50 text-indigo-700",
    sectionGap: "space-y-5",
  },
  creative: {
    pageClass: "bg-white text-gray-900 w-full max-w-[800px] mx-auto p-10 sm:p-12 print:p-0 font-sans text-sm",
    headingClass: "text-[11px] font-bold uppercase tracking-wider text-fuchsia-700",
    dividerClass: "border-t border-fuchsia-100",
    nameClass: "text-[28px] font-bold tracking-tight text-gray-900",
    taglineClass: "text-sm font-semibold text-fuchsia-600 mt-0.5",
    bodyClass: "text-[13px] leading-6 text-gray-600",
    metaClass: "text-[11px] text-gray-400",
    accentClass: "text-fuchsia-700",
    chipClass: "bg-fuchsia-50 text-fuchsia-700",
    sectionGap: "space-y-5",
  },
  capability: {
    pageClass: "bg-white text-gray-900 w-full max-w-[800px] mx-auto p-10 sm:p-12 print:p-0 font-sans text-sm",
    headingClass: "text-[11px] font-bold uppercase tracking-wider text-sky-800",
    dividerClass: "border-t border-sky-100",
    nameClass: "text-2xl font-bold text-gray-900",
    taglineClass: "text-sm text-sky-700 font-medium mt-0.5",
    bodyClass: "text-[13px] leading-6 text-gray-600",
    metaClass: "text-[11px] text-gray-400",
    accentClass: "text-sky-700",
    chipClass: "bg-sky-50 text-sky-700",
    sectionGap: "space-y-5",
  },
  precision: {
    pageClass: "bg-white text-gray-900 w-full max-w-[800px] mx-auto p-11 sm:p-14 print:p-0 font-sans text-sm",
    headingClass: "text-[11px] font-bold uppercase tracking-[0.2em] text-amber-900",
    dividerClass: "border-t border-gray-200",
    nameClass: "text-[26px] font-bold tracking-tight text-gray-900",
    taglineClass: "text-sm text-gray-500 mt-1",
    bodyClass: "text-[13px] leading-7 text-gray-600",
    metaClass: "text-[11px] text-gray-400 font-medium",
    accentClass: "text-amber-800",
    chipClass: "bg-amber-50 text-amber-800",
    sectionGap: "space-y-6",
  },
  purity: {
    pageClass: "bg-white text-stone-900 w-full max-w-[800px] mx-auto p-14 sm:p-16 print:p-0 font-sans text-sm",
    headingClass: "text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500",
    dividerClass: "border-t border-stone-100",
    nameClass: "text-[30px] font-light tracking-tight text-stone-900",
    taglineClass: "text-sm text-stone-500 mt-1 tracking-wide",
    bodyClass: "text-[13px] leading-7 text-stone-600",
    metaClass: "text-[11px] text-stone-400 tracking-wide",
    accentClass: "text-stone-800",
    chipClass: "bg-stone-100 text-stone-700",
    sectionGap: "space-y-7",
  },
};

/** Color-stripped structural classes, used only when composing a non-default color theme. */
interface TemplateStructure {
  headingClass: string;
  dividerClass: string;
  taglineClass: string;
}

const TEMPLATE_STRUCTURE: Record<ResumeTemplate, TemplateStructure> = {
  classic: {
    headingClass: "text-xs font-bold uppercase tracking-wider",
    dividerClass: "border-t",
    taglineClass: "text-sm mt-0.5",
  },
  formal: {
    headingClass: "text-[11px] font-semibold uppercase tracking-[0.18em]",
    dividerClass: "border-t",
    taglineClass: "text-sm font-medium mt-0.5",
  },
  creative: {
    headingClass: "text-[11px] font-bold uppercase tracking-wider",
    dividerClass: "border-t",
    taglineClass: "text-sm font-semibold mt-0.5",
  },
  capability: {
    headingClass: "text-[11px] font-bold uppercase tracking-wider",
    dividerClass: "border-t",
    taglineClass: "text-sm font-medium mt-0.5",
  },
  precision: {
    headingClass: "text-[11px] font-bold uppercase tracking-[0.2em]",
    dividerClass: "border-t",
    taglineClass: "text-sm mt-1",
  },
  purity: {
    headingClass: "text-[10px] font-semibold uppercase tracking-[0.3em]",
    dividerClass: "border-t",
    taglineClass: "text-sm mt-1 tracking-wide",
  },
};

/** Color tokens for the decorative/accent spots every template exposes, including the
 * bespoke ones hardcoded in index.tsx (Formal's avatar, Creative's gradient blob,
 * Capability's sidebar border reuses `divider`). */
export interface ColorTokens {
  heading: string;
  tagline: string;
  accent: string;
  divider: string;
  chipBg: string;
  chipText: string;
  avatarBg: string;
  /** Translucent header-border tint used by Formal's top rule — distinct from `divider`. */
  headerBorder: string;
  gradientFrom: string;
  gradientTo: string;
}

/** Exact preservation of each template's current shipped color — used only for colorTheme "default". */
const TEMPLATE_DEFAULT_COLORS: Record<ResumeTemplate, ColorTokens> = {
  classic: {
    heading: "text-gray-800",
    tagline: "text-gray-500",
    accent: "text-gray-900",
    divider: "border-gray-200",
    chipBg: "bg-slate-100",
    chipText: "text-slate-700",
    avatarBg: "bg-gray-900",
    headerBorder: "border-gray-900/10",
    gradientFrom: "from-gray-400",
    gradientTo: "to-gray-600",
  },
  formal: {
    heading: "text-indigo-900",
    tagline: "text-indigo-700",
    accent: "text-indigo-700",
    divider: "border-slate-200",
    chipBg: "bg-indigo-50",
    chipText: "text-indigo-700",
    avatarBg: "bg-indigo-900",
    headerBorder: "border-indigo-900/10",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-indigo-700",
  },
  creative: {
    heading: "text-fuchsia-700",
    tagline: "text-fuchsia-600",
    accent: "text-fuchsia-700",
    divider: "border-fuchsia-100",
    chipBg: "bg-fuchsia-50",
    chipText: "text-fuchsia-700",
    avatarBg: "bg-fuchsia-700",
    headerBorder: "border-fuchsia-900/10",
    gradientFrom: "from-fuchsia-500",
    gradientTo: "to-purple-600",
  },
  capability: {
    heading: "text-sky-800",
    tagline: "text-sky-700",
    accent: "text-sky-700",
    divider: "border-sky-100",
    chipBg: "bg-sky-50",
    chipText: "text-sky-700",
    avatarBg: "bg-sky-800",
    headerBorder: "border-sky-900/10",
    gradientFrom: "from-sky-500",
    gradientTo: "to-sky-700",
  },
  precision: {
    heading: "text-amber-900",
    tagline: "text-gray-500",
    accent: "text-amber-800",
    divider: "border-gray-200",
    chipBg: "bg-amber-50",
    chipText: "text-amber-800",
    avatarBg: "bg-amber-900",
    headerBorder: "border-amber-900/10",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-700",
  },
  purity: {
    heading: "text-stone-500",
    tagline: "text-stone-500",
    accent: "text-stone-800",
    divider: "border-stone-100",
    chipBg: "bg-stone-100",
    chipText: "text-stone-700",
    avatarBg: "bg-stone-800",
    headerBorder: "border-stone-900/10",
    gradientFrom: "from-stone-500",
    gradientTo: "to-stone-700",
  },
};

/** The 6 pickable accent colors — template-agnostic, fully spelled-out Tailwind classes. */
const COLOR_THEME_TOKENS: Record<Exclude<ResumeColorTheme, "default">, ColorTokens> = {
  blue: {
    heading: "text-blue-900",
    tagline: "text-blue-700",
    accent: "text-blue-700",
    divider: "border-blue-100",
    chipBg: "bg-blue-50",
    chipText: "text-blue-700",
    avatarBg: "bg-blue-900",
    headerBorder: "border-blue-900/10",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-700",
  },
  purple: {
    heading: "text-purple-900",
    tagline: "text-purple-700",
    accent: "text-purple-700",
    divider: "border-purple-100",
    chipBg: "bg-purple-50",
    chipText: "text-purple-700",
    avatarBg: "bg-purple-900",
    headerBorder: "border-purple-900/10",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-700",
  },
  green: {
    heading: "text-emerald-900",
    tagline: "text-emerald-700",
    accent: "text-emerald-700",
    divider: "border-emerald-100",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    avatarBg: "bg-emerald-900",
    headerBorder: "border-emerald-900/10",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-700",
  },
  black: {
    heading: "text-zinc-900",
    tagline: "text-zinc-700",
    accent: "text-zinc-700",
    divider: "border-zinc-200",
    chipBg: "bg-zinc-100",
    chipText: "text-zinc-800",
    avatarBg: "bg-zinc-900",
    headerBorder: "border-zinc-900/10",
    gradientFrom: "from-zinc-700",
    gradientTo: "to-zinc-900",
  },
  orange: {
    heading: "text-orange-900",
    tagline: "text-orange-700",
    accent: "text-orange-700",
    divider: "border-orange-100",
    chipBg: "bg-orange-50",
    chipText: "text-orange-700",
    avatarBg: "bg-orange-900",
    headerBorder: "border-orange-900/10",
    gradientFrom: "from-orange-500",
    gradientTo: "to-orange-700",
  },
  teal: {
    heading: "text-teal-900",
    tagline: "text-teal-700",
    accent: "text-teal-700",
    divider: "border-teal-100",
    chipBg: "bg-teal-50",
    chipText: "text-teal-700",
    avatarBg: "bg-teal-900",
    headerBorder: "border-teal-900/10",
    gradientFrom: "from-teal-500",
    gradientTo: "to-teal-700",
  },
};

/**
 * Typography presets are applied as a single wrapper class using CSS descendant
 * selectors, not by rewriting individual field classes: name is always the sole
 * `<h1>`, its tagline (when present) is always the `<p>` immediately after it,
 * and every section heading is an `<h2>` (see sections.tsx / templates/index.tsx).
 * A descendant-selector rule reliably overrides a plain utility class applied
 * directly on that element regardless of Tailwind's internal stylesheet order,
 * because it has higher CSS specificity — no fragile string-replacing needed.
 */
const TYPOGRAPHY_PRESETS: Record<ResumeTypographyTheme, string> = {
  modern: "",
  corporate: "[&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:font-bold [&_h2]:tracking-[0.22em]",
  elegant:
    "[&_h1]:font-light [&_h1]:tracking-wide [&_h1+p]:italic [&_h1+p]:font-normal [&_h2]:font-medium [&_h2]:tracking-[0.28em]",
  minimal: "[&_h1]:font-medium [&_h1]:tracking-tight [&_h2]:font-medium [&_h2]:tracking-wider [&_h2]:text-[10px]",
  editorial:
    "[&_h1]:font-light [&_h1]:tracking-tight [&_h1]:text-[34px] [&_h2]:font-semibold [&_h2]:tracking-[0.35em] [&_h2]:text-[9px]",
};

function composeColorTheme(template: ResumeTemplate, color: ColorTokens): TemplateTheme {
  const base = TEMPLATE_THEMES[template];
  const structure = TEMPLATE_STRUCTURE[template];
  return {
    ...base,
    headingClass: `${structure.headingClass} ${color.heading}`,
    dividerClass: `${structure.dividerClass} ${color.divider}`,
    taglineClass: `${structure.taglineClass} ${color.tagline}`,
    accentClass: color.accent,
    chipClass: `${color.chipBg} ${color.chipText}`,
  };
}

export function resolveColorTokens(
  template: ResumeTemplate,
  colorTheme: ResumeColorTheme = "default"
): ColorTokens {
  return colorTheme === "default" ? TEMPLATE_DEFAULT_COLORS[template] : COLOR_THEME_TOKENS[colorTheme];
}

export function resolveTheme(
  template: ResumeTemplate,
  colorTheme: ResumeColorTheme = "default",
  typographyTheme: ResumeTypographyTheme = "modern"
): TemplateTheme {
  const composed =
    colorTheme === "default"
      ? TEMPLATE_THEMES[template]
      : composeColorTheme(template, COLOR_THEME_TOKENS[colorTheme]);

  const typographyClass = TYPOGRAPHY_PRESETS[typographyTheme];
  if (!typographyClass) return composed;

  return { ...composed, pageClass: `${composed.pageClass} ${typographyClass}` };
}

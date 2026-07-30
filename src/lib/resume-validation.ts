import {
  RESUME_COLOR_THEMES,
  RESUME_TEMPLATES,
  RESUME_TYPOGRAPHY_THEMES,
  type ResumeColorTheme,
  type ResumeTemplate,
  type ResumeTypographyTheme,
} from "@/types/resume.types";

export function sanitizeTemplateInput(value: unknown): ResumeTemplate | undefined {
  if (typeof value === "string" && RESUME_TEMPLATES.includes(value as ResumeTemplate)) {
    return value as ResumeTemplate;
  }
  return undefined;
}

export function sanitizeColorThemeInput(value: unknown): ResumeColorTheme | undefined {
  if (typeof value === "string" && RESUME_COLOR_THEMES.includes(value as ResumeColorTheme)) {
    return value as ResumeColorTheme;
  }
  return undefined;
}

export function sanitizeTypographyThemeInput(value: unknown): ResumeTypographyTheme | undefined {
  if (typeof value === "string" && RESUME_TYPOGRAPHY_THEMES.includes(value as ResumeTypographyTheme)) {
    return value as ResumeTypographyTheme;
  }
  return undefined;
}

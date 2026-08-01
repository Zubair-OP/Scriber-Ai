import {
  RESUME_COLOR_THEMES,
  RESUME_TEMPLATES,
  RESUME_TYPOGRAPHY_THEMES,
  type ResumeColorTheme,
  type ResumeTemplate,
  type ResumeTypographyTheme,
} from "@/types/resume.types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// A MongoDB ObjectId serialized into a URL is always a 24-char hex string.
// Matching it directly keeps this module free of the server-only mongoose
// import, so client components can safely reuse the sanitizers below.
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export function validateObjectId(id: string, resourceName = "resume"): void {
  if (!OBJECT_ID_REGEX.test(id)) {
    throw new ValidationError(`Invalid ${resourceName} id`);
  }
}

// Safe JSON body parse: a malformed/empty payload becomes a 400, not an unhandled 500.
export async function parseJsonBody(req: Request): Promise<Record<string, unknown>> {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Invalid request body");
  }
  return body as Record<string, unknown>;
}

export function validateNonEmptyString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} is required`);
  }
  if (value.length > maxLength) {
    throw new ValidationError(`${field} is too large to process`);
  }
  return value;
}

export function validateStringArray(
  value: unknown,
  field: string,
  maxItems: number,
  maxItemLength = 200
): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ValidationError(`${field} is required`);
  }
  if (value.length > maxItems) {
    throw new ValidationError(`${field} is too large to process`);
  }
  for (const item of value) {
    if (typeof item !== "string" || item.trim().length === 0) {
      throw new ValidationError(`${field} contains invalid values`);
    }
    if (item.length > maxItemLength) {
      throw new ValidationError(`${field} is too large to process`);
    }
  }
  return value as string[];
}

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

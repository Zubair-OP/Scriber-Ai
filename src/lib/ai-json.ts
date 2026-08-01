export class AiResponseError extends Error {
  constructor(message = "AI service returned an invalid response") {
    super(message);
    this.name = "AiResponseError";
  }
}

// Gemini frequently wraps JSON in markdown fences despite prompt instructions.
const stripCodeFences = (raw: string): string =>
  raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

export function parseAiJson<T = unknown>(raw: string | undefined | null): T {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    throw new AiResponseError();
  }

  try {
    return JSON.parse(stripCodeFences(raw)) as T;
  } catch {
    throw new AiResponseError();
  }
}

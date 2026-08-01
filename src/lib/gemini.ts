import { GoogleGenAI } from "@google/genai";
import { AiResponseError } from "@/lib/ai-json";

// Requests hang indefinitely without a ceiling; a stuck call would tie up a serverless invocation.
const REQUEST_TIMEOUT_MS = 30_000;

let client: GoogleGenAI | null = null;

// Lazily built so a missing key surfaces as a handled per-request error, not an import-time crash.
function getClient(): GoogleGenAI {
    if (client) return client;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    client = new GoogleGenAI({ apiKey });
    return client;
}

export async function generateAiContent(prompt: string): Promise<string> {
    const response = await Promise.race([
        getClient().models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        }),
        new Promise<never>((_, reject) =>
            setTimeout(
                () => reject(new AiResponseError("AI request timed out")),
                REQUEST_TIMEOUT_MS
            )
        ),
    ]);

    if (typeof response.text !== "string" || response.text.trim().length === 0) {
        throw new AiResponseError();
    }

    return response.text;
}

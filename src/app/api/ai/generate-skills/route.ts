import { generateAiContent } from "@/lib/gemini";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { requireProPlan } from "@/lib/plan";
import { handleApiError } from "@/lib/api-error";
import { parseAiJson } from "@/lib/ai-json";
import { parseJsonBody, validateNonEmptyString } from "@/lib/resume-validation";
import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const userId = await getCurrentUser();
        await requireProPlan(userId);

        const body = await parseJsonBody(req);

        const jobTitle = validateNonEmptyString(body.jobTitle, "Job title", 120);
        const experienceLevel = validateNonEmptyString(body.experienceLevel, "Experience level", 40);

        const prompt = `
            You are an ATS optimization specialist.
            
            Generate technical skills for the following role.
            
            Job Title:
            ${jobTitle}
            
            Experience Level:
            ${experienceLevel}
            
            CRITICAL OUTPUT INSTRUCTIONS:
            
            - Return ONLY a valid JSON array.
            - Do NOT wrap the array in quotes.
            - Do NOT return an object.
            - Do NOT return markdown.
            - Do NOT use \`\`\`json code blocks.
            - Do NOT add explanations, notes, headings, or introductory text.
            - The response must start with "[" and end with "]".
            - Every item must be a string.
            - Include only technical skills.
            - Exclude all soft skills.
            - Generate 15-25 relevant technical skills.
            - Remove duplicates.
            
            Valid Example:
            
            [
              "JavaScript",
              "TypeScript",
              "React.js",
              "Node.js",
              "MongoDB"
            ]
            
            Invalid Example:
            
            {
              "skills": [
                "JavaScript",
                "React.js"
              ]
            }
            
            Invalid Example:
            
            "[
              \\"JavaScript\\",
              \\"React.js\\"
            ]"
            
            Output:
            Return ONLY the raw JSON array.
            `;

        const result = await generateAiContent(prompt);

        const skills = parseAiJson(result);

        return NextResponse.json<ApiResponse>({
            success: true, message: "Skills created", data: {
                skills
            }
        }, {
            status: 201
        })

    } catch (error) {
        return handleApiError(error, "error in Skills generation api");
    }
}
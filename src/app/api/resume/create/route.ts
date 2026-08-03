import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import UserModel from "@/models/user.model";
import { getResumeLimit } from "@/lib/plan-limits";
import { sanitizeTemplateInput } from "@/lib/resume-validation";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body: Record<string, unknown> = await req.json().catch(() => ({}));
    const template = sanitizeTemplateInput(body.template) ?? "classic";

    const userId = await getCurrentUser();

    const user = await UserModel.findById(userId).select("plan");
    const resumeLimit = getResumeLimit(user?.plan);

    if (Number.isFinite(resumeLimit)) {
      const existingResumeCount = await ResumeModel.countDocuments({ user_id: userId });

      if (existingResumeCount >= resumeLimit) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message:
              user?.plan === "pro"
                ? "Pro plan is limited to 5 resumes. Upgrade to Enterprise for unlimited resumes."
                : "Free plan is limited to 1 resume. Upgrade to Pro for up to 5 resumes or Enterprise for unlimited.",
          },
          { status: 403 }
        );
      }
    }

    const newResume = await ResumeModel.create({
      user_id: userId,
      title: "",
      summary: "",
      template,
      personalInfo: {},
      workExperience: [],
      projects: [],
      education: [],
      certifications: [],
      skills: [],
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume created successfully",
        data: newResume,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "error in create resume api");
  }
}
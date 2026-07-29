import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

const FREE_PLAN_RESUME_LIMIT = 1;

export async function POST() {
  try {
    await connectToDB();

    const userId = await getCurrentUser();

    const user = await UserModel.findById(userId).select("plan");

    if (user && user.plan !== "pro") {
      const existingResumeCount = await ResumeModel.countDocuments({ user_id: userId });

      if (existingResumeCount >= FREE_PLAN_RESUME_LIMIT) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Free plan is limited to 1 resume. Upgrade to Pro for unlimited resumes.",
          },
          { status: 403 }
        );
      }
    }

    const newResume = await ResumeModel.create({
      user_id: userId,
      title: "",
      summary: "",
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
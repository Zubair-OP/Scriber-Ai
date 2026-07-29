import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const userId = await getCurrentUser();

    const resumes = await ResumeModel.find({ user_id: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resumes fetched successfully",
        data: resumes,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "error in get all resumes api");
  }
}

import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();
    const { resumeId } = await params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid resume id" },
        { status: 400 }
      );
    }

    const body: Record<string, unknown> = await req.json().catch(() => ({}));
    if (typeof body.isPublic !== "boolean") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "isPublic must be a boolean" },
        { status: 400 }
      );
    }

    const resume = await ResumeModel.findOne({ _id: resumeId, user_id: userId });

    if (!resume) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    resume.isPublic = body.isPublic;
    if (body.isPublic && !resume.shareId) {
      resume.shareId = randomUUID();
    }
    await resume.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Sharing settings updated",
        data: { isPublic: resume.isPublic, shareId: resume.shareId },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "error in resume share api");
  }
}

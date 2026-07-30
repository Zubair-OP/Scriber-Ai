import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import {
  sanitizeColorThemeInput,
  sanitizeTemplateInput,
  sanitizeTypographyThemeInput,
} from "@/lib/resume-validation";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

const allowedPersonalInfoKeys = [
  "fullname",
  "email",
  "mobile",
  "location",
  "github",
  "linkedIn",
  "portfolio",
];

function pickStringFields<T extends Record<string, unknown>>(
  source: T,
  keys: (keyof T)[]
): Record<string, string> {
  return keys.reduce<Record<string, string>>((acc, key) => {
    const value = source[key];
    if (typeof value === "string") acc[key as string] = value;
    return acc;
  }, {});
}

function sanitizeObjectArray(
  value: unknown,
  keys: string[]
): Record<string, string>[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => pickStringFields(item, keys));
}

function sanitizeProjectsArray(value: unknown): Record<string, unknown>[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      ...pickStringFields(item, ["title", "description", "githubUrl", "liveUrl"]),
      techStack: Array.isArray(item.techStack)
        ? item.techStack.filter((tech): tech is string => typeof tech === "string")
        : [],
    }));
}

function sanitizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === "string");
}

const sanitizeResumeUpdate = (body: Record<string, unknown>) => {
  const update: Record<string, unknown> = {};

  if (typeof body.title === "string") update.title = body.title;
  if (typeof body.summary === "string") update.summary = body.summary;
  const template = sanitizeTemplateInput(body.template);
  if (template) update.template = template;
  const colorTheme = sanitizeColorThemeInput(body.colorTheme);
  if (colorTheme) update.colorTheme = colorTheme;
  const typographyTheme = sanitizeTypographyThemeInput(body.typographyTheme);
  if (typographyTheme) update.typographyTheme = typographyTheme;

  if (body.personalInfo && typeof body.personalInfo === "object" && !Array.isArray(body.personalInfo)) {
    update.personalInfo = pickStringFields(
      body.personalInfo as Record<string, unknown>,
      allowedPersonalInfoKeys
    );
  }

  const education = sanitizeObjectArray(body.education, ["institute", "degree", "startDate", "endDate"]);
  if (education) update.education = education;

  const workExperience = sanitizeObjectArray(body.workExperience, [
    "company",
    "position",
    "startDate",
    "endDate",
    "description",
  ]);
  if (workExperience) update.workExperience = workExperience;

  const projects = sanitizeProjectsArray(body.projects);
  if (projects) update.projects = projects;

  const skills = sanitizeStringArray(body.skills);
  if (skills) update.skills = skills;

  const certifications = sanitizeStringArray(body.certifications);
  if (certifications) update.certifications = certifications;

  return update;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();

    const { resumeId } = await params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid resume id",
        },
        { status: 400 }
      );
    }

    const resume = await ResumeModel.findOne({
      _id: resumeId,
      user_id: userId,
    });

    if (!resume)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 }
      );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume fetched successfully",
        data: resume,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "error in get resume api");
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();

    const body = await req.json();

    const { resumeId } = await params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid resume id",
        },
        { status: 400 }
      );
    }

    const update = sanitizeResumeUpdate(body);

    if (Object.keys(update).length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "No valid resume fields provided",
        },
        { status: 400 }
      );
    }

    const updatedResume = await ResumeModel.findOneAndUpdate(
      {
        _id: resumeId,
        user_id: userId,
      },
      {
        $set: update,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedResume)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume failed to update",
        },
        { status: 400 }
      );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume updated successfully",
        data: updatedResume,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "error in updatedResume api");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();

    const { resumeId } = await params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid resume id",
        },
        { status: 400 }
      );
    }

    const deletedResume = await ResumeModel.findOneAndDelete({
      _id: resumeId,
      user_id: userId,
    });

    if (!deletedResume)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 }
      );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "error in delete resume api");
  }
}

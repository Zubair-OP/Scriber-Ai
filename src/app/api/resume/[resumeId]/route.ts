import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import {
  sanitizeColorThemeInput,
  sanitizeTemplateInput,
  sanitizeTypographyThemeInput,
  validateObjectId,
} from "@/lib/resume-validation";
import { NextRequest, NextResponse } from "next/server";

const allowedPersonalInfoKeys = [
  "fullname",
  "email",
  "mobile",
  "location",
  "github",
  "linkedIn",
  "portfolio",
];

// Defensive caps so a malicious client can't bloat a document with unbounded input.
const MAX_FIELD_LENGTH = 5000;
const MAX_ARRAY_ITEMS = 100;

function capString(value: string): string {
  return value.length > MAX_FIELD_LENGTH ? value.slice(0, MAX_FIELD_LENGTH) : value;
}

function pickStringFields<T extends Record<string, unknown>>(
  source: T,
  keys: (keyof T)[]
): Record<string, string> {
  return keys.reduce<Record<string, string>>((acc, key) => {
    const value = source[key];
    if (typeof value === "string") acc[key as string] = capString(value);
    return acc;
  }, {});
}

function sanitizeObjectArray(
  value: unknown,
  keys: string[]
): Record<string, string>[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .slice(0, MAX_ARRAY_ITEMS)
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => pickStringFields(item, keys));
}

function sanitizeProjectsArray(value: unknown): Record<string, unknown>[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .slice(0, MAX_ARRAY_ITEMS)
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      ...pickStringFields(item, ["title", "description", "githubUrl", "liveUrl"]),
      techStack: Array.isArray(item.techStack)
        ? item.techStack
            .slice(0, MAX_ARRAY_ITEMS)
            .filter((tech): tech is string => typeof tech === "string")
            .map(capString)
        : [],
    }));
}

function sanitizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .slice(0, MAX_ARRAY_ITEMS)
    .filter((item): item is string => typeof item === "string")
    .map(capString);
}

const sanitizeResumeUpdate = (body: Record<string, unknown>) => {
  const update: Record<string, unknown> = {};

  if (typeof body.title === "string") update.title = capString(body.title);
  if (typeof body.summary === "string") update.summary = capString(body.summary);
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

    validateObjectId(resumeId);

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

    const { resumeId } = await params;

    validateObjectId(resumeId);

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid request body",
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

    validateObjectId(resumeId);

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

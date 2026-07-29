import mongoose from "mongoose";
import { chromium } from "playwright";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;

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

    const resume = await ResumeModel.findOne({ _id: resumeId, user_id: userId });

    if (!resume) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const origin = req.nextUrl.origin;

    browser = await chromium.launch();
    const context = await browser.newContext();
    await context.addCookies([
      {
        name: "token",
        value: token,
        url: origin,
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);

    const page = await context.newPage();
    await page.goto(`${origin}/resume/${resumeId}/print`, { waitUntil: "networkidle" });
    await page.waitForSelector("#resume-print-area");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0.4in", bottom: "0.4in", left: "0.4in", right: "0.4in" },
    });

    await browser.close();
    browser = null;

    const fileName = `${(resume.title || resume.personalInfo?.fullname || "resume").replace(/[^a-z0-9-_ ]/gi, "").trim() || "resume"}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    return handleApiError(error, "error in resume pdf export api");
  }
}

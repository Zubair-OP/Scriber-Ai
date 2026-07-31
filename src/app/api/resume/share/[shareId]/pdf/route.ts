import { chromium } from "playwright";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;

  try {
    await connectToDB();

    const { shareId } = await params;

    const resume = await ResumeModel.findOne({ shareId, isPublic: true }).select(
      "title personalInfo"
    );

    if (!resume) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    const origin = req.nextUrl.origin;

    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${origin}/resume/share/${shareId}`, { waitUntil: "networkidle" });
    await page.waitForSelector("#shared-resume-print-area");

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
    return handleApiError(error, "error in shared resume pdf export api");
  }
}

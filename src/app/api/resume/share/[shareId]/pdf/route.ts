import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";

export const runtime = "nodejs";

// Vercel Pro = 60s, Hobby = 10s (clamped automatically)
export const maxDuration = 60;

async function launchBrowser() {
  const isVercel = !!process.env.VERCEL;

  if (isVercel) {
    const chromium = await import("@sparticuz/chromium");
    const puppeteerCore = await import("puppeteer-core");

    chromium.default.setGraphicsMode = false;

    return puppeteerCore.default.launch({
      args: [
        ...chromium.default.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--no-zygote",
      ],
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  }

  // Local dev: use puppeteer (bundles its own Chromium automatically)
  const puppeteer = await import("puppeteer");
  return puppeteer.default.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
    ],
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let browser: any = null;

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

    const origin =
      (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
        ? process.env.NEXT_PUBLIC_APP_URL
        : undefined) ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
      req.nextUrl.origin;

    browser = await launchBrowser();
    const page = await browser.newPage();

    // Use "domcontentloaded" instead of "networkidle" for reliability on serverless
    await page.goto(`${origin}/resume/share/${shareId}`, {
      waitUntil: "domcontentloaded",
      timeout: 25000,
    });

    await page.waitForSelector("#shared-resume-print-area", { timeout: 8000 });

    // Small delay to let fonts render visually
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0.4in", bottom: "0.4in", left: "0.4in", right: "0.4in" },
    });

    await browser.close();
    browser = null;

    const fileName = `${(resume.title || resume.personalInfo?.fullname || "resume")
      .replace(/[^a-z0-9-_ ]/gi, "")
      .trim() || "resume"}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("[Shared PDF] Error:", error instanceof Error ? error.message : String(error));
    if (browser) {
      await browser.close().catch(() => {});
    }
    return handleApiError(error, "error in shared resume pdf export api");
  }
}

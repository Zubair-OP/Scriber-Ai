import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import { validateObjectId } from "@/lib/resume-validation";
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
  { params }: { params: Promise<{ resumeId: string }> }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let browser: any = null;

  try {
    await connectToDB();

    const userId = await getCurrentUser();
    const { resumeId } = await params;

    validateObjectId(resumeId);

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

    browser = await launchBrowser();
    const page = await browser.newPage();

    const { hostname } = new URL(origin);

    // Set cookie headers for request authentication
    await page.setExtraHTTPHeaders({
      cookie: `token=${token}`,
    });

    await page.setCookie({
      name: "token",
      value: token,
      domain: hostname,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: origin.startsWith("https"),
    });

    await page.goto(`${origin}/resume/${resumeId}/print`, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    // Wait for the resume template to actually render
    await page.waitForSelector("#resume-print-area", { timeout: 8000 });

    // Small delay to let fonts render visually (avoids blank/FOUT fonts in PDF)
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
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[PDF] Error:", msg);
    if (browser) {
      await browser.close().catch(() => {});
    }
    // TEMP: expose real error so we can debug — remove after fix
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

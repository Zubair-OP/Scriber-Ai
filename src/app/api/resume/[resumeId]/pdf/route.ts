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

    // Disable graphics for serverless (reduces memory usage)
    chromium.default.setGraphicsMode = false;

    // Provide the remote binary URL explicitly so Chromium downloads to /tmp
    // Version must match the installed @sparticuz/chromium package version
    const CHROMIUM_REMOTE_URL =
      "https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.tar";

    return puppeteerCore.default.launch({
      args: chromium.default.args,
      defaultViewport: null,
      executablePath: await chromium.default.executablePath(CHROMIUM_REMOTE_URL),
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

    // req.nextUrl.origin automatically resolves to the correct domain on every environment:
    // - Local dev: http://localhost:3000
    // - Vercel preview: https://scriber-ai-xxx.vercel.app
    // - Vercel production / custom domain: https://your-domain.com
    const origin = req.nextUrl.origin;

    browser = await launchBrowser();
    const page = await browser.newPage();

    // Extract hostname for cookie domain (required for Puppeteer to attach it correctly)
    const { hostname } = new URL(origin);

    // Pass auth cookie so the print page can authenticate the user
    await page.setCookie({
      name: "token",
      value: token,
      domain: hostname,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: origin.startsWith("https"),
    });

    // Use "domcontentloaded" instead of "networkidle0":
    // networkidle0 waits for ALL network to stop (CDN fonts never fully settle)
    // domcontentloaded fires as soon as HTML is parsed — fast & reliable
    await page.goto(`${origin}/resume/${resumeId}/print`, {
      waitUntil: "domcontentloaded",
      timeout: 25000,
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

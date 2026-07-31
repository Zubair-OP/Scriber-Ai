import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import connectToDB from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { resumeToDraft } from "@/lib/resume-draft";
import { TEMPLATE_COMPONENTS } from "@/components/builder/templates";

export const metadata: Metadata = {
  title: "Shared Resume | Scriber AI",
  robots: { index: false, follow: false },
};

export default async function SharedResumePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  await connectToDB();

  const resume = await ResumeModel.findOne({ shareId, isPublic: true })
    .select("-user_id -__v")
    .lean();

  if (!resume) {
    notFound();
  }

  const draft = resumeToDraft(resume as unknown as Record<string, unknown>);
  const Template = TEMPLATE_COMPONENTS[draft.template];

  return (
    <div className="min-h-screen bg-surface-subtle/60 print:bg-white">
      <div className="border-b border-surface-variant bg-white print:hidden">
        <div className="max-w-[1000px] mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
          <span className="font-headline-sm text-on-surface">Scriber AI</span>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-primary-container text-white font-label-sm px-4 py-2 rounded-full hover:bg-primary transition-colors"
          >
            Create your own resume
          </Link>
        </div>
      </div>
      <main className="py-10 px-4 print:p-0" id="shared-resume-print-area">
        <div className="max-w-[800px] mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.08)] print:shadow-none print:max-w-none">
          <Template resume={draft} />
        </div>
      </main>
    </div>
  );
}

import { notFound } from "next/navigation";
import mongoose from "mongoose";
import connectToDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import { resumeToDraft } from "@/lib/resume-draft";
import { TEMPLATE_COMPONENTS } from "@/components/builder/templates";
import { AutoPrintTrigger } from "@/components/AutoPrintTrigger";

export default async function ResumePrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ resumeId: string }>;
  searchParams: Promise<{ autoPrint?: string }>;
}) {
  const { resumeId } = await params;
  const { autoPrint } = await searchParams;

  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    notFound();
  }

  await connectToDB();

  let userId: string;
  try {
    userId = await getCurrentUser();
  } catch {
    notFound();
  }

  const resume = await ResumeModel.findOne({ _id: resumeId, user_id: userId }).lean();

  if (!resume) {
    notFound();
  }

  const draft = resumeToDraft(resume as unknown as Record<string, unknown>);
  const Template = TEMPLATE_COMPONENTS[draft.template];

  return (
    <div id="resume-print-area" className="bg-white">
      {autoPrint === "true" && <AutoPrintTrigger />}
      <Template resume={draft} />
    </div>
  );
}

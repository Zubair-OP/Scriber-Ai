import { emptyDraft, type ResumeDraft } from "@/components/builder/types";

export function resumeToDraft(resume: Record<string, unknown>): ResumeDraft {
  return {
    title: typeof resume.title === "string" ? resume.title : "",
    template: (resume.template as ResumeDraft["template"]) || "classic",
    summary: typeof resume.summary === "string" ? resume.summary : "",
    personalInfo: { ...emptyDraft.personalInfo, ...(resume.personalInfo as object) },
    education: Array.isArray(resume.education) ? resume.education : [],
    workExperience: Array.isArray(resume.workExperience) ? resume.workExperience : [],
    projects: Array.isArray(resume.projects) ? resume.projects : [],
    skills: Array.isArray(resume.skills) ? resume.skills : [],
    certifications: Array.isArray(resume.certifications) ? resume.certifications : [],
  };
}

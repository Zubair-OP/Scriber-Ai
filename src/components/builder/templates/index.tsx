import type { ResumeDraft } from "@/components/builder/types";
import type { ResumeTemplate } from "@/types/resume.types";
import {
  ContactLine,
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  SkillsAndCertificationsSection,
  SummarySection,
  headline,
} from "@/components/builder/templates/sections";

const PAGE_CLASS = "bg-white text-gray-900 w-full max-w-[800px] mx-auto p-10 sm:p-12 font-sans text-sm";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

export function ClassicTemplate({ resume }: { resume: ResumeDraft }) {
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={PAGE_CLASS}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        {headline(resume) && <p className="text-sm text-gray-500 mt-0.5">{headline(resume)}</p>}
        <div className="mt-2">
          <ContactLine resume={resume} />
        </div>
      </div>
      <div className="space-y-4 mb-4">
        <SummarySection resume={resume} />
      </div>
      <div className="space-y-4">
        <ExperienceSection resume={resume} />
        <EducationSection resume={resume} />
        <SkillsAndCertificationsSection resume={resume} />
        <ProjectsSection resume={resume} />
      </div>
    </div>
  );
}

export function FormalTemplate({ resume }: { resume: ResumeDraft }) {
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={PAGE_CLASS}>
      <div className="flex gap-4 mb-4 items-start">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold flex-shrink-0">
          {initials(name)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          {headline(resume) && <p className="text-sm text-gray-500 mt-0.5">{headline(resume)}</p>}
          <div className="mt-1">
            <SummarySection resume={resume} />
          </div>
          <div className="mt-2">
            <ContactLine resume={resume} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <ExperienceSection resume={resume} />
        <EducationSection resume={resume} />
        <SkillsAndCertificationsSection resume={resume} />
        <ProjectsSection resume={resume} />
      </div>
    </div>
  );
}

export function CreativeTemplate({ resume }: { resume: ResumeDraft }) {
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={PAGE_CLASS}>
      <div className="flex gap-4 mb-4 items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          {headline(resume) && <p className="text-sm text-primary-container font-semibold mt-0.5">{headline(resume)}</p>}
          <div className="mt-1">
            <SummarySection resume={resume} />
          </div>
          <div className="mt-2">
            <ContactLine resume={resume} />
          </div>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-container/70 to-primary/70 flex-shrink-0" />
      </div>
      <div className="space-y-4">
        <ExperienceSection resume={resume} />
        <ProjectsSection resume={resume} />
        <EducationSection resume={resume} />
        <SkillsAndCertificationsSection resume={resume} />
      </div>
    </div>
  );
}

export function PrecisionTemplate({ resume }: { resume: ResumeDraft }) {
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={PAGE_CLASS}>
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        {headline(resume) && <p className="text-sm text-gray-500 mt-0.5">{headline(resume)}</p>}
        <div className="mt-2 max-w-lg mx-auto">
          <SummarySection resume={resume} />
        </div>
        <div className="mt-2 flex justify-center">
          <ContactLine resume={resume} />
        </div>
      </div>
      <div className="space-y-4">
        <ExperienceSection resume={resume} />
        <EducationSection resume={resume} />
        <SkillsAndCertificationsSection resume={resume} />
        <ProjectsSection resume={resume} />
      </div>
    </div>
  );
}

export function CapabilityTemplate({ resume }: { resume: ResumeDraft }) {
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={PAGE_CLASS}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        {headline(resume) && <p className="text-sm text-gray-500 mt-0.5">{headline(resume)}</p>}
        <div className="mt-2">
          <ContactLine resume={resume} />
        </div>
        <div className="mt-2">
          <SummarySection resume={resume} />
        </div>
      </div>
      <div className="space-y-4">
        <ExperienceSection resume={resume} />
        <EducationSection resume={resume} />
        <ProjectsSection resume={resume} />
        <SkillsAndCertificationsSection resume={resume} />
      </div>
    </div>
  );
}

export function PurityTemplate({ resume }: { resume: ResumeDraft }) {
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={PAGE_CLASS}>
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        <div className="mt-1 flex justify-center">
          <ContactLine resume={resume} />
        </div>
        <div className="mt-3 max-w-xl mx-auto">
          <SummarySection resume={resume} />
        </div>
      </div>
      <div className="space-y-4">
        <ExperienceSection resume={resume} />
        <EducationSection resume={resume} />
        <SkillsAndCertificationsSection resume={resume} />
        <ProjectsSection resume={resume} />
      </div>
    </div>
  );
}

export const TEMPLATE_COMPONENTS: Record<ResumeTemplate, (props: { resume: ResumeDraft }) => React.ReactElement> = {
  classic: ClassicTemplate,
  formal: FormalTemplate,
  creative: CreativeTemplate,
  precision: PrecisionTemplate,
  capability: CapabilityTemplate,
  purity: PurityTemplate,
};

export const TEMPLATE_LABELS: Record<ResumeTemplate, string> = {
  classic: "Classic",
  formal: "Formal",
  creative: "Creative",
  precision: "Precision",
  capability: "Capability",
  purity: "Purity",
};

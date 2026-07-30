import type { ResumeDraft } from "@/components/builder/types";
import type { ResumeTemplate } from "@/types/resume.types";
import {
  resolveColorTokens,
  resolveTheme,
  type TemplateTheme,
} from "@/components/builder/templates/theme";
import {
  ContactLine,
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  SkillsAndCertificationsSection,
  SummarySection,
  headline,
} from "@/components/builder/templates/sections";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

export function ClassicTemplate({ resume }: { resume: ResumeDraft }) {
  const theme = resolveTheme("classic", resume.colorTheme, resume.typographyTheme);
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={theme.pageClass}>
      <div className="mb-4">
        <h1 className={theme.nameClass}>{name}</h1>
        {headline(resume) && <p className={theme.taglineClass}>{headline(resume)}</p>}
        <div className="mt-2">
          <ContactLine resume={resume} theme={theme} />
        </div>
      </div>
      <div className={`${theme.sectionGap} mb-4`}>
        <SummarySection resume={resume} theme={theme} />
      </div>
      <div className={theme.sectionGap}>
        <ExperienceSection resume={resume} theme={theme} />
        <EducationSection resume={resume} theme={theme} />
        <SkillsAndCertificationsSection resume={resume} theme={theme} />
        <ProjectsSection resume={resume} theme={theme} />
      </div>
    </div>
  );
}

export function FormalTemplate({ resume }: { resume: ResumeDraft }) {
  const theme = resolveTheme("formal", resume.colorTheme, resume.typographyTheme);
  const color = resolveColorTokens("formal", resume.colorTheme);
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={theme.pageClass}>
      <div className={`flex gap-5 mb-5 items-start pb-5 border-b-2 ${color.headerBorder}`}>
        <div className={`w-14 h-14 rounded-full ${color.avatarBg} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
          {initials(name)}
        </div>
        <div className="flex-1">
          <h1 className={theme.nameClass}>{name}</h1>
          {headline(resume) && <p className={theme.taglineClass}>{headline(resume)}</p>}
          <div className="mt-2">
            <SummarySection resume={resume} theme={theme} />
          </div>
          <div className="mt-2">
            <ContactLine resume={resume} theme={theme} />
          </div>
        </div>
      </div>
      <div className={theme.sectionGap}>
        <ExperienceSection resume={resume} theme={theme} />
        <EducationSection resume={resume} theme={theme} />
        <SkillsAndCertificationsSection resume={resume} theme={theme} />
        <ProjectsSection resume={resume} theme={theme} />
      </div>
    </div>
  );
}

export function CreativeTemplate({ resume }: { resume: ResumeDraft }) {
  const theme = resolveTheme("creative", resume.colorTheme, resume.typographyTheme);
  const color = resolveColorTokens("creative", resume.colorTheme);
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={theme.pageClass}>
      <div className="flex gap-4 mb-5 items-start justify-between">
        <div className="flex-1">
          <h1 className={theme.nameClass}>{name}</h1>
          {headline(resume) && <p className={theme.taglineClass}>{headline(resume)}</p>}
          <div className="mt-2">
            <SummarySection resume={resume} theme={theme} />
          </div>
          <div className="mt-2">
            <ContactLine resume={resume} theme={theme} />
          </div>
        </div>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color.gradientFrom} ${color.gradientTo} flex-shrink-0`} />
      </div>
      <div className={theme.sectionGap}>
        <ExperienceSection resume={resume} theme={theme} />
        <ProjectsSection resume={resume} theme={theme} />
        <EducationSection resume={resume} theme={theme} />
        <SkillsAndCertificationsSection resume={resume} theme={theme} variant="chips" />
      </div>
    </div>
  );
}

export function PrecisionTemplate({ resume }: { resume: ResumeDraft }) {
  const theme = resolveTheme("precision", resume.colorTheme, resume.typographyTheme);
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={theme.pageClass}>
      <div className="mb-6 text-center">
        <h1 className={theme.nameClass}>{name}</h1>
        {headline(resume) && <p className={theme.taglineClass}>{headline(resume)}</p>}
        <div className="mt-3 max-w-lg mx-auto">
          <SummarySection resume={resume} theme={theme} />
        </div>
        <div className="mt-3 flex justify-center">
          <ContactLine resume={resume} theme={theme} />
        </div>
      </div>
      <div className={theme.sectionGap}>
        <ExperienceSection resume={resume} theme={theme} />
        <EducationSection resume={resume} theme={theme} />
        <SkillsAndCertificationsSection resume={resume} theme={theme} />
        <ProjectsSection resume={resume} theme={theme} />
      </div>
    </div>
  );
}

export function CapabilityTemplate({ resume }: { resume: ResumeDraft }) {
  const theme = resolveTheme("capability", resume.colorTheme, resume.typographyTheme);
  const color = resolveColorTokens("capability", resume.colorTheme);
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={theme.pageClass}>
      <div className={`mb-5 pb-5 border-b ${color.divider}`}>
        <h1 className={theme.nameClass}>{name}</h1>
        {headline(resume) && <p className={theme.taglineClass}>{headline(resume)}</p>}
        <div className="mt-2">
          <ContactLine resume={resume} theme={theme} />
        </div>
      </div>
      {/* Floats, not grid/flex: Chromium's print pagination can't fragment a
          grid/flex box across pages, so a tall two-column grid here would get
          shoved onto a fresh page as one atomic unit, leaving the previous
          page mostly blank. Floats fragment normally across page breaks. */}
      <div className="[&::after]:content-[''] [&::after]:block [&::after]:clear-both">
        <div className="float-left w-[180px] space-y-5">
          <SkillsAndCertificationsSidebar resume={resume} theme={theme} />
        </div>
        <div className={`${theme.sectionGap} ml-[212px]`}>
          <SummarySection resume={resume} theme={theme} />
          <ExperienceSection resume={resume} theme={theme} />
          <ProjectsSection resume={resume} theme={theme} />
          <EducationSection resume={resume} theme={theme} />
        </div>
      </div>
    </div>
  );
}

function SkillsAndCertificationsSidebar({
  resume,
  theme,
}: {
  resume: ResumeDraft;
  theme: TemplateTheme;
}) {
  const hasSkills = resume.skills.length > 0;
  const hasCertifications = (resume.certifications || []).length > 0;

  if (!hasSkills && !hasCertifications) return null;

  return (
    <>
      {hasSkills && (
        <div>
          <h2 className={`${theme.headingClass} mb-2`}>Skills</h2>
          <div className="flex flex-col gap-1.5">
            {resume.skills.map((skill, i) => (
              <span key={i} className={`text-[12px] font-medium ${theme.accentClass}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {hasCertifications && (
        <div>
          <h2 className={`${theme.headingClass} mb-2`}>Certifications</h2>
          <ul className={`${theme.bodyClass} space-y-1`}>
            {resume.certifications?.map((cert, i) => <li key={i}>{cert}</li>)}
          </ul>
        </div>
      )}
    </>
  );
}

export function PurityTemplate({ resume }: { resume: ResumeDraft }) {
  const theme = resolveTheme("purity", resume.colorTheme, resume.typographyTheme);
  const name = resume.personalInfo.fullname || "Your Name";
  return (
    <div className={theme.pageClass}>
      <div className="mb-8 text-center">
        <h1 className={theme.nameClass}>{name}</h1>
        <div className="mt-2 flex justify-center">
          <ContactLine resume={resume} theme={theme} />
        </div>
        <div className="mt-4 max-w-xl mx-auto">
          <SummarySection resume={resume} theme={theme} />
        </div>
      </div>
      <div className={theme.sectionGap}>
        <ExperienceSection resume={resume} theme={theme} />
        <EducationSection resume={resume} theme={theme} />
        <SkillsAndCertificationsSection resume={resume} theme={theme} />
        <ProjectsSection resume={resume} theme={theme} />
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

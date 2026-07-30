import type { ResumeDraft } from "@/components/builder/types";
import type { TemplateTheme } from "@/components/builder/templates/theme";
import { formatMonthYear } from "@/lib/date-format";

export function ContactLine({ resume, theme }: { resume: ResumeDraft; theme: TemplateTheme }) {
  const { email, mobile, location, github, linkedIn, portfolio } = resume.personalInfo;
  const parts = [email, mobile, location, github, linkedIn, portfolio].filter(Boolean);

  if (parts.length === 0) return null;

  return <p className={theme.metaClass}>{parts.join("  |  ")}</p>;
}

export function SummarySection({ resume, theme }: { resume: ResumeDraft; theme: TemplateTheme }) {
  if (!resume.summary) return null;
  return <p className={theme.bodyClass}>{resume.summary}</p>;
}

export function ExperienceSection({ resume, theme }: { resume: ResumeDraft; theme: TemplateTheme }) {
  const items = resume.workExperience || [];
  if (items.length === 0) return null;

  return (
    <section className={`${theme.dividerClass} pt-4`}>
      <h2 className={`${theme.headingClass} mb-3`}>Work Experience</h2>
      <div className="space-y-4">
        {items.map((exp, i) => (
          <div key={i}>
            <div className="flex justify-between items-baseline gap-4 flex-wrap">
              <p className={`font-semibold text-sm ${theme.accentClass}`}>
                {exp.position || "Position"}
                <span className="text-gray-400 font-normal"> · {exp.company || "Company"}</span>
              </p>
              <p className={`${theme.metaClass} whitespace-nowrap`}>
                {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
              </p>
            </div>
            {exp.description && (
              <p className={`mt-1 whitespace-pre-line ${theme.bodyClass}`}>{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function EducationSection({ resume, theme }: { resume: ResumeDraft; theme: TemplateTheme }) {
  const items = resume.education || [];
  if (items.length === 0) return null;

  return (
    <section className={`${theme.dividerClass} pt-4`}>
      <h2 className={`${theme.headingClass} mb-3`}>Education</h2>
      <div className="space-y-3">
        {items.map((edu, i) => (
          <div key={i} className="flex justify-between items-baseline gap-4 flex-wrap">
            <div>
              <p className={`font-semibold text-sm ${theme.accentClass}`}>{edu.institute || "Institute"}</p>
              {edu.degree && <p className="text-[12px] text-gray-500">{edu.degree}</p>}
            </div>
            <p className={`${theme.metaClass} whitespace-nowrap`}>
              {formatMonthYear(edu.startDate)} – {formatMonthYear(edu.endDate)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProjectsSection({ resume, theme }: { resume: ResumeDraft; theme: TemplateTheme }) {
  const items = resume.projects || [];
  if (items.length === 0) return null;

  return (
    <section className={`${theme.dividerClass} pt-4`}>
      <h2 className={`${theme.headingClass} mb-3`}>Projects</h2>
      <div className="space-y-4">
        {items.map((project, i) => (
          <div key={i}>
            <div className="flex justify-between items-baseline gap-4 flex-wrap">
              <p className={`font-semibold text-sm ${theme.accentClass}`}>{project.title || "Project"}</p>
              <p className={`${theme.metaClass} whitespace-nowrap`}>
                {[project.githubUrl, project.liveUrl].filter(Boolean).join(" · ")}
              </p>
            </div>
            {project.description && (
              <p className={`mt-1 whitespace-pre-line ${theme.bodyClass}`}>{project.description}</p>
            )}
            {project.techStack?.length ? (
              <p className={`mt-1 ${theme.metaClass}`}>{project.techStack.join(", ")}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkillsAndCertificationsSection({
  resume,
  theme,
  variant = "list",
}: {
  resume: ResumeDraft;
  theme: TemplateTheme;
  variant?: "list" | "chips";
}) {
  const hasSkills = resume.skills.length > 0;
  const hasCertifications = (resume.certifications || []).length > 0;

  if (!hasSkills && !hasCertifications) return null;

  return (
    <section className={`${theme.dividerClass} pt-4 flex flex-wrap gap-8`}>
      {hasSkills && (
        <div>
          <h2 className={`${theme.headingClass} mb-2`}>Skills</h2>
          {variant === "chips" ? (
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((skill, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${theme.chipClass}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className={theme.bodyClass}>{resume.skills.join(", ")}</p>
          )}
        </div>
      )}
      {hasCertifications && (
        <div>
          <h2 className={`${theme.headingClass} mb-2`}>Certifications</h2>
          <ul className={`${theme.bodyClass} space-y-0.5`}>
            {resume.certifications?.map((cert, i) => <li key={i}>{cert}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

export function headline(resume: ResumeDraft): string {
  return resume.workExperience?.[0]?.position || "";
}

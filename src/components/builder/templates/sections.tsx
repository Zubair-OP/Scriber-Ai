import type { ResumeDraft } from "@/components/builder/types";

export function ContactLine({ resume }: { resume: ResumeDraft }) {
  const { email, mobile, location, github, linkedIn, portfolio } = resume.personalInfo;
  const parts = [email, mobile, location, github, linkedIn, portfolio].filter(Boolean);

  if (parts.length === 0) return null;

  return <p className="text-[11px] text-gray-500">{parts.join("  |  ")}</p>;
}

export function SummarySection({ resume }: { resume: ResumeDraft }) {
  if (!resume.summary) return null;
  return <p className="text-[13px] leading-6 text-gray-600">{resume.summary}</p>;
}

export function ExperienceSection({ resume }: { resume: ResumeDraft }) {
  const items = resume.workExperience || [];
  if (items.length === 0) return null;

  return (
    <section className="border-t border-gray-200 pt-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">Work Experience</h2>
      <div className="space-y-4">
        {items.map((exp, i) => (
          <div key={i}>
            <div className="flex justify-between items-baseline gap-4 flex-wrap">
              <p className="font-semibold text-gray-900 text-sm">
                {exp.position || "Position"}
                <span className="text-gray-400 font-normal"> · {exp.company || "Company"}</span>
              </p>
              <p className="text-[11px] text-gray-400 whitespace-nowrap">
                {exp.startDate} – {exp.endDate}
              </p>
            </div>
            {exp.description && (
              <p className="mt-1 text-gray-600 whitespace-pre-line text-[13px] leading-6">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function EducationSection({ resume }: { resume: ResumeDraft }) {
  const items = resume.education || [];
  if (items.length === 0) return null;

  return (
    <section className="border-t border-gray-200 pt-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">Education</h2>
      <div className="space-y-3">
        {items.map((edu, i) => (
          <div key={i} className="flex justify-between items-baseline gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{edu.institute || "Institute"}</p>
              {edu.degree && <p className="text-[12px] text-gray-500">{edu.degree}</p>}
            </div>
            <p className="text-[11px] text-gray-400 whitespace-nowrap">
              {edu.startDate} – {edu.endDate}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProjectsSection({ resume }: { resume: ResumeDraft }) {
  const items = resume.projects || [];
  if (items.length === 0) return null;

  return (
    <section className="border-t border-gray-200 pt-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">Projects</h2>
      <div className="space-y-4">
        {items.map((project, i) => (
          <div key={i}>
            <div className="flex justify-between items-baseline gap-4 flex-wrap">
              <p className="font-semibold text-gray-900 text-sm">{project.title || "Project"}</p>
              <p className="text-[11px] text-gray-400 whitespace-nowrap">
                {[project.githubUrl, project.liveUrl].filter(Boolean).join(" · ")}
              </p>
            </div>
            {project.description && (
              <p className="mt-1 text-gray-600 whitespace-pre-line text-[13px] leading-6">{project.description}</p>
            )}
            {project.techStack?.length ? (
              <p className="mt-1 text-[11px] text-gray-400">{project.techStack.join(", ")}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkillsAndCertificationsSection({ resume }: { resume: ResumeDraft }) {
  const hasSkills = resume.skills.length > 0;
  const hasCertifications = (resume.certifications || []).length > 0;

  if (!hasSkills && !hasCertifications) return null;

  return (
    <section className="border-t border-gray-200 pt-4 flex flex-wrap gap-8">
      {hasSkills && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">Skills</h2>
          <p className="text-[13px] text-gray-600">{resume.skills.join(", ")}</p>
        </div>
      )}
      {hasCertifications && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">Certifications</h2>
          <ul className="text-[13px] text-gray-600 space-y-0.5">
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

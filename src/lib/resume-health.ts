export type HealthStatus = "complete" | "partial" | "missing";

export interface HealthSection {
  key: string;
  label: string;
  status: HealthStatus;
  message: string;
}

export interface ResumeHealth {
  score: number;
  sections: HealthSection[];
}

/** Minimal shape covering both `IResume` (dashboard) and `ResumeDraft` (builder). */
export interface HealthInput {
  personalInfo?: {
    fullname?: string;
    email?: string;
    mobile?: string;
    location?: string;
    github?: string;
    linkedIn?: string;
    portfolio?: string;
  };
  summary?: string;
  workExperience?: { position?: string; company?: string; description?: string }[];
  education?: { institute?: string; degree?: string }[];
  skills?: string[];
  certifications?: string[];
  projects?: { title?: string; description?: string }[];
}

interface Weighted extends HealthSection {
  points: number;
  max: number;
}

function scoreContact(input: HealthInput): Weighted {
  const info = input.personalInfo || {};
  const max = 15;
  if (!info.fullname || !info.email) {
    return { key: "contact", label: "Contact info", status: "missing", message: "Add your name and email.", points: 0, max };
  }
  const extras = [info.mobile, info.location, info.github, info.linkedIn, info.portfolio].filter(Boolean).length;
  if (extras >= 2) {
    return { key: "contact", label: "Contact info", status: "complete", message: "Contact details look complete.", points: max, max };
  }
  return {
    key: "contact",
    label: "Contact info",
    status: "partial",
    message: "Add a phone number, location, or a link (GitHub/LinkedIn/portfolio).",
    points: 10,
    max,
  };
}

function scoreSummary(input: HealthInput): Weighted {
  const max = 15;
  const summary = (input.summary || "").trim();
  if (!summary) {
    return { key: "summary", label: "Summary", status: "missing", message: "Add a short professional summary.", points: 0, max };
  }
  if (summary.length < 40) {
    return { key: "summary", label: "Summary", status: "partial", message: "Your summary is quite short — aim for 2-3 sentences.", points: 8, max };
  }
  return { key: "summary", label: "Summary", status: "complete", message: "Summary looks good.", points: max, max };
}

function scoreExperience(input: HealthInput): Weighted {
  const max = 25;
  const items = input.workExperience || [];
  if (items.length === 0) {
    return { key: "experience", label: "Work experience", status: "missing", message: "Add at least one work experience entry.", points: 0, max };
  }
  const withDescriptions = items.filter((item) => (item.description || "").trim().length >= 30).length;
  if (withDescriptions === 0) {
    return {
      key: "experience",
      label: "Work experience",
      status: "partial",
      message: "Add descriptions to your work experience entries.",
      points: 12,
      max,
    };
  }
  const bonus = items.length >= 2 ? max : max - 5;
  return { key: "experience", label: "Work experience", status: "complete", message: "Work experience is well described.", points: bonus, max };
}

function scoreEducation(input: HealthInput): Weighted {
  const max = 15;
  const items = input.education || [];
  if (items.length === 0) {
    return { key: "education", label: "Education", status: "missing", message: "Add at least one education entry.", points: 0, max };
  }
  return { key: "education", label: "Education", status: "complete", message: "Education looks good.", points: max, max };
}

function scoreSkills(input: HealthInput): Weighted {
  const max = 15;
  const skills = input.skills || [];
  if (skills.length === 0) {
    return { key: "skills", label: "Skills", status: "missing", message: "Add a few relevant skills.", points: 0, max };
  }
  if (skills.length < 3) {
    return { key: "skills", label: "Skills", status: "partial", message: "Add a few more skills (aim for at least 3).", points: 8, max };
  }
  return { key: "skills", label: "Skills", status: "complete", message: "Skills section looks good.", points: max, max };
}

function scoreProjects(input: HealthInput): Weighted {
  const max = 10;
  const items = input.projects || [];
  if (items.length === 0) {
    return { key: "projects", label: "Projects", status: "missing", message: "Optional, but a project or two strengthens your resume.", points: 0, max };
  }
  const withDescriptions = items.some((item) => (item.description || "").trim().length > 0);
  return {
    key: "projects",
    label: "Projects",
    status: withDescriptions ? "complete" : "partial",
    message: withDescriptions ? "Projects look good." : "Add a short description to your project(s).",
    points: withDescriptions ? max : max / 2,
    max,
  };
}

function scoreCertifications(input: HealthInput): Weighted {
  const max = 5;
  const items = input.certifications || [];
  return {
    key: "certifications",
    label: "Certifications",
    status: items.length > 0 ? "complete" : "missing",
    message: items.length > 0 ? "Certifications added." : "Optional — add any relevant certifications.",
    points: items.length > 0 ? max : 0,
    max,
  };
}

export function computeResumeHealth(input: HealthInput): ResumeHealth {
  const weighted = [
    scoreContact(input),
    scoreSummary(input),
    scoreExperience(input),
    scoreEducation(input),
    scoreSkills(input),
    scoreProjects(input),
    scoreCertifications(input),
  ];

  const totalPoints = weighted.reduce((sum, section) => sum + section.points, 0);
  const totalMax = weighted.reduce((sum, section) => sum + section.max, 0);
  const score = Math.round((totalPoints / totalMax) * 100);

  return {
    score,
    sections: weighted.map(({ key, label, status, message }) => ({ key, label, status, message })),
  };
}

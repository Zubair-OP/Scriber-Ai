import type {
  IEducation,
  IPersonalInfo,
  IProjects,
  IWorkExperience,
  ResumeColorTheme,
  ResumeTemplate,
  ResumeTypographyTheme,
} from "@/types/resume.types";

export interface ResumeDraft {
  title: string;
  template: ResumeTemplate;
  colorTheme: ResumeColorTheme;
  typographyTheme: ResumeTypographyTheme;
  summary: string;
  personalInfo: IPersonalInfo;
  education: IEducation[];
  workExperience: IWorkExperience[];
  projects: IProjects[];
  skills: string[];
  certifications: string[];
}

export const emptyPersonalInfo: IPersonalInfo = {
  fullname: "",
  email: "",
  mobile: "",
  location: "",
  github: "",
  linkedIn: "",
  portfolio: "",
};

export const emptyDraft: ResumeDraft = {
  title: "",
  template: "classic",
  colorTheme: "default",
  typographyTheme: "modern",
  summary: "",
  personalInfo: emptyPersonalInfo,
  education: [],
  workExperience: [],
  projects: [],
  skills: [],
  certifications: [],
};

export interface StepProps {
  draft: ResumeDraft;
  updateDraft: (patch: Partial<ResumeDraft>) => void;
}

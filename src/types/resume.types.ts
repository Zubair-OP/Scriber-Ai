import { Types } from "mongoose";

export interface IPersonalInfo {
    fullname: string;
    email: string;
    mobile: string;
    location: string;
    github: string;
    linkedIn: string;
    portfolio: string;
}

export interface IWorkExperience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string
}

export interface IProjects {
    title: string;
    description: string;
    githubUrl: string;
    liveUrl: string;
    techStack: string[];
}

export interface IEducation {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
}

export const RESUME_TEMPLATES = [
    "classic",
    "formal",
    "creative",
    "precision",
    "capability",
    "purity",
] as const;

export type ResumeTemplate = (typeof RESUME_TEMPLATES)[number];

export const RESUME_COLOR_THEMES = [
    "default",
    "blue",
    "purple",
    "green",
    "black",
    "orange",
    "teal",
] as const;

export type ResumeColorTheme = (typeof RESUME_COLOR_THEMES)[number];

export const RESUME_TYPOGRAPHY_THEMES = [
    "modern",
    "corporate",
    "elegant",
    "minimal",
    "editorial",
] as const;

export type ResumeTypographyTheme = (typeof RESUME_TYPOGRAPHY_THEMES)[number];

export interface IResume {
    _id?: string;
    user_id: Types.ObjectId;
    title: string;
    summary: string;
    template: ResumeTemplate;
    colorTheme?: ResumeColorTheme;
    typographyTheme?: ResumeTypographyTheme;
    personalInfo: IPersonalInfo;
    workExperience?: IWorkExperience[];
    projects: IProjects[];
    skills: string[];
    education: IEducation[];
    certifications?: string[];
    isPublic?: boolean;
    shareId?: string;
    createdAt?: Date
    updatedAt?: Date
}
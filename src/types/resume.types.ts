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

export interface IResume {
    _id?: string;
    user_id: Types.ObjectId;
    title: string;
    summary: string;
    template: ResumeTemplate;
    personalInfo: IPersonalInfo;
    workExperience?: IWorkExperience[];
    projects: IProjects[];
    skills: string[];
    education: IEducation[];
    certifications?: string[];
    createdAt?: Date
    updatedAt?: Date
}
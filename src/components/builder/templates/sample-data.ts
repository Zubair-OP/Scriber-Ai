import type { ResumeDraft } from "@/components/builder/types";

export const SAMPLE_RESUME_DRAFT: ResumeDraft = {
  title: "Sample Resume",
  template: "classic",
  colorTheme: "default",
  typographyTheme: "modern",
  summary:
    "Product-minded software engineer with 6+ years building and scaling web applications. Led cross-functional teams to ship features used by millions of users while mentoring junior engineers.",
  personalInfo: {
    fullname: "Jordan Avery",
    email: "jordan.avery@email.com",
    mobile: "+1 (555) 123-4567",
    location: "Austin, TX",
    github: "github.com/jordanavery",
    linkedIn: "linkedin.com/in/jordanavery",
    portfolio: "jordanavery.dev",
  },
  workExperience: [
    {
      company: "Northwind Labs",
      position: "Senior Software Engineer",
      startDate: "2022-03",
      endDate: "Present",
      description:
        "Led the redesign of the core checkout flow, increasing conversion by 18%. Mentored a team of 4 engineers and introduced automated testing that cut regression bugs by 40%.",
    },
    {
      company: "Bluepeak Systems",
      position: "Software Engineer",
      startDate: "2019-06",
      endDate: "2022-02",
      description:
        "Built and maintained internal tooling used by 200+ engineers. Migrated legacy services to a microservice architecture, reducing deployment time from hours to minutes.",
    },
  ],
  education: [
    {
      institute: "University of Texas at Austin",
      degree: "B.S. in Computer Science",
      startDate: "2015-08",
      endDate: "2019-05",
    },
  ],
  projects: [
    {
      title: "Routewise",
      description:
        "An open-source route-optimization tool for delivery fleets, used by 3 logistics startups in production.",
      githubUrl: "github.com/jordanavery/routewise",
      liveUrl: "routewise.dev",
      techStack: ["TypeScript", "Next.js", "PostgreSQL"],
    },
    {
      title: "Pulse Analytics Dashboard",
      description:
        "A real-time analytics dashboard for tracking product usage metrics across web and mobile clients.",
      githubUrl: "github.com/jordanavery/pulse",
      liveUrl: "",
      techStack: ["React", "D3.js", "Node.js"],
    },
  ],
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "System Design",
    "CI/CD",
    "Team Leadership",
  ],
  certifications: ["AWS Certified Solutions Architect"],
};

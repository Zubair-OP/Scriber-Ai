import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";

export const metadata: Metadata = {
  title: "About Us | The Team Behind Scriber AI Resume Builder",
  description:
    "Learn about Scriber AI — the free AI resume builder built by job seekers, for job seekers. Our mission: make every professional resume ATS-ready, recruiter-approved, and ready to land interviews.",
  openGraph: {
    title: "About Scriber AI | AI-Powered Resume Builder",
    description:
      "Scriber AI was built because the resume process is broken. We're fixing it — one ATS-optimized resume at a time.",
    url: "https://scriber.ai/about",
  },
  alternates: {
    canonical: "https://scriber.ai/about",
  },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Scriber AI",
  "description":
    "Scriber AI is a free AI-powered resume builder that helps job seekers create ATS-optimized, recruiter-approved resumes in under 15 minutes.",
  "url": "https://scriber.ai/about",
  "mainEntity": {
    "@type": "Organization",
    "name": "Scriber AI",
    "url": "https://scriber.ai",
    "foundingDate": "2023",
    "description":
      "Scriber AI combines AI-powered writing suggestions with recruiter-approved templates to help job seekers land more interviews.",
    "sameAs": [
      "https://twitter.com/scriberAI",
      "https://linkedin.com/company/scriber-ai",
    ],
  },
};

const stats = [
  { value: "5M+", label: "Resumes created", icon: "description" },
  { value: "73%", label: "More interview callbacks", icon: "trending_up" },
  { value: "4.9/5", label: "Average user rating", icon: "star" },
  { value: "<15min", label: "Average build time", icon: "timer" },
];

const values = [
  {
    icon: "visibility",
    title: "Transparency over tricks",
    body:
      "We don't inflate stats or make promises we can't keep. If your resume has a weakness, our checker will tell you plainly — and show you how to fix it.",
  },
  {
    icon: "psychology",
    title: "AI that respects your voice",
    body:
      "Our AI strengthens what you've written rather than replacing it with generic corporate language. Your story stays yours — just sharper.",
  },
  {
    icon: "lock",
    title: "Privacy by design",
    body:
      "Your career data is sensitive. We keep it secure, never sell it, and give you full control over what gets shared and what doesn't.",
  },
  {
    icon: "all_inclusive",
    title: "Accessible from day one",
    body:
      "The core builder, ATS checker, and a solid template set are free — no credit card required. We believe everyone deserves a fair shot at a great resume.",
  },
];

const team = [
  {
    name: "Jordan Lee",
    role: "Co-founder & CEO",
    bio: "Former recruiter at three Fortune 500 companies. Reviewed 40,000+ resumes. Built Scriber AI to fix the exact problems he saw every day.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Sharma",
    role: "Co-founder & CTO",
    bio: "ML engineer who spent five years building NLP systems. Turned that expertise into AI that writes resume bullets without sounding like a robot.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Marcus Webb",
    role: "Head of Design",
    bio: "Previously led product design at two career-tech startups. Obsessed with the idea that a great resume tool should feel as premium as the job it helps you land.",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Aisha Okafor",
    role: "Head of Growth",
    bio: "Built SEO-driven growth from zero to 1M users at her last company. Joined Scriber AI to put the right people in front of the tool that changes their job search.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <SiteHeader />

      <main className="flex-grow">
        {/* ── Hero ── */}
        <section className="pt-32 pb-20 px-4 md:px-10 bg-surface relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container/30 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="max-w-[800px] mx-auto text-center relative z-10">
            <span className="inline-flex items-center px-3 py-1 mb-5 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
              Our story
            </span>
            <h1 className="font-display-xl text-on-surface mb-6">
              We built Scriber AI because the{" "}
              <span className="text-primary">hiring process is broken</span>
            </h1>
            <p className="font-body-lg text-on-surface-variant leading-relaxed mb-8">
              Over 75% of resumes never reach a human. They&apos;re silently rejected by
              Applicant Tracking Systems — not because the candidate isn&apos;t qualified,
              but because the resume didn&apos;t speak the right language. We built Scriber AI
              to close that gap. Our free AI resume builder creates ATS-optimized,
              recruiter-approved resumes in under 15 minutes — so qualified candidates
              actually get seen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-primary-container text-white px-7 py-3 rounded-full font-title-md hover:bg-primary active:scale-[0.98] transition-all"
              >
                Try it free — no credit card
              </Link>
              <Link
                href="/contact"
                className="border border-outline/30 text-on-surface-variant px-7 py-3 rounded-full font-title-md hover:bg-surface-container transition-all"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-16 bg-surface-container-low border-y border-surface-variant">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display-xl text-primary mb-1">{s.value}</div>
                  <div className="font-label-lg text-on-surface-variant">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission (blog-style prose) ── */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-[760px] mx-auto px-4 md:px-10">
            <span className="inline-flex items-center px-3 py-1 mb-5 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
              Our mission
            </span>
            <h2 className="font-display-lg text-on-surface mb-8">
              Making a great resume accessible to everyone
            </h2>

            <div className="space-y-6 font-body-lg text-on-surface-variant leading-relaxed">
              <p>
                When our founding team was on their own job hunts, they saw the same pattern
                over and over: talented people sending hundreds of applications and hearing
                nothing back. Not because they weren&apos;t good enough — but because their
                resumes weren&apos;t structured to survive an ATS filter.
              </p>
              <p>
                At the same time, Jordan — our CEO — was sitting on the other side of the
                table as a recruiter, watching great candidates get auto-rejected before he
                ever had the chance to look at their application. The system was clearly
                failing both sides.
              </p>
              <p>
                So we built Scriber AI: an AI resume builder that understands how ATS works,
                what keywords matter for each role, and how to frame real experience into
                bullet points that pass filters and impress humans. The result is a resume
                that works whether it&apos;s read by a robot or a real recruiter.
              </p>
              <p>
                Today, more than 5 million job seekers trust Scriber AI to help them land
                interviews. We measure success not in resumes created, but in callbacks
                received, offers accepted, and careers launched.
              </p>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-24 md:py-32 bg-surface-container-low">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
                What we believe
              </span>
              <h2 className="font-display-lg text-on-surface mb-4">Our values</h2>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                These aren&apos;t wall posters. They&apos;re the actual constraints we put on every
                product decision we make.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="p-1.5 bg-white/50 backdrop-blur-sm rounded-[1.25rem] border border-surface-variant/40 hover:border-primary-container/30 transition-all"
                >
                  <div className="bg-white rounded-[1rem] p-8 border border-surface-variant/20 h-full">
                    <div className="w-12 h-12 bg-secondary-container/60 rounded-xl flex items-center justify-center mb-5 text-primary">
                      <span className="material-symbols-outlined text-[28px]">{v.icon}</span>
                    </div>
                    <h3 className="font-title-lg text-on-surface mb-3">{v.title}</h3>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
                The team
              </span>
              <h2 className="font-display-lg text-on-surface mb-4">
                Built by people who&apos;ve been on both sides
              </h2>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Recruiters, engineers, designers, and growth specialists — all united by one
                goal: getting great people into great jobs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="p-1.5 bg-white/50 backdrop-blur-sm rounded-[1.25rem] border border-surface-variant/40 hover:border-primary-container/30 transition-all"
                >
                  <div className="bg-white rounded-[1rem] p-6 border border-surface-variant/20 text-center h-full">
                    <Image
                      src={member.avatar}
                      alt={`${member.name} — ${member.role} at Scriber AI`}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-surface-variant"
                    />
                    <h3 className="font-title-lg text-on-surface mb-1">{member.name}</h3>
                    <p className="font-label-sm text-primary mb-3 uppercase tracking-wider">{member.role}</p>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 md:py-32 px-4 md:px-10">
          <div className="max-w-[1200px] mx-auto p-1.5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 rounded-[2rem] border border-emerald-500/20">
            <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-700 text-white p-12 md:p-20 rounded-[1.75rem] text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-5 rotate-12 transform translate-x-1/2 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="font-display-lg text-white mb-6">
                  Ready to build a resume that actually works?
                </h2>
                <p className="font-body-lg mb-10 text-white/90 max-w-xl mx-auto">
                  Join 5M+ job seekers who trust Scriber AI to create ATS-optimized,
                  recruiter-approved resumes. Free to start — no credit card required.
                </p>
                <Link
                  href="/signup"
                  className="inline-block bg-white text-emerald-800 px-8 py-3.5 rounded-full font-title-lg hover:bg-slate-50 hover:shadow-xl active:scale-[0.98] transition-all"
                >
                  Build my resume — it&apos;s free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

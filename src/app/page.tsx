import { SiteHeader } from "@/components/home/sections/site-header";
import { HeroSection } from "@/components/home/sections/hero-section";
import { TrustedBySection } from "@/components/home/sections/trusted-by-section";
import { FeaturesSection } from "@/components/home/sections/features-section";
import { TestimonialsSection } from "@/components/home/sections/testimonials-section";
import { CtaSection } from "@/components/home/sections/cta-section";
import { SiteFooter } from "@/components/home/sections/site-footer";

// Entity: SoftwareApplication (Prompt 18 — entity optimization)
const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Scriber AI Resume Builder",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description":
    "Scriber AI is the best free AI resume builder. Create an ATS-optimized, recruiter-approved resume in under 5 minutes with AI-powered suggestions.",
  "url": "https://scriber.ai",
  "softwareVersion": "2.0",
  "datePublished": "2023-01-01",
  "featureList": [
    "AI-powered resume writing suggestions",
    "ATS compatibility scoring",
    "18+ recruiter-approved resume templates",
    "PDF and Word export",
    "Real-time ATS keyword analysis",
    "Cover letter builder",
    "Drag-and-drop editor",
  ],
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "49",
    "priceCurrency": "USD",
    "offerCount": "3",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2847",
  },
  "author": {
    "@type": "Organization",
    "name": "Scriber AI",
  },
};

// Entity: WebSite with SearchAction — Sitelinks search box signal (Prompt 18)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Scriber AI",
  "url": "https://scriber.ai",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://scriber.ai/templates?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// Entity: Organization — brand authority signals (Prompt 18)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Scriber AI",
  "url": "https://scriber.ai",
  "logo": "https://scriber.ai/favicon.svg",
  "sameAs": [
    "https://twitter.com/scriberAI",
    "https://linkedin.com/company/scriber-ai",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "availableLanguage": "English",
  },
};

// FAQPage — reordered by 4 buyer awareness stages (Prompt 16 search intent mapping)
// Stage 1: Problem-unaware  →  Stage 2: Problem-aware  →  Stage 3: Solution-aware  →  Stage 4: Ready-to-hire
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    // Stage 2: Problem-aware — "why are resumes rejected?"
    {
      "@type": "Question",
      "name": "Why do most resumes get rejected before a human reads them?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Over 75% of resumes are filtered out by Applicant Tracking Systems (ATS) before a recruiter ever sees them. ATS software scans for specific keywords, formatting patterns, and section structure. Resumes with tables, graphics, or missing keywords get auto-rejected. Scriber AI is purpose-built to pass these filters.",
      },
    },
    // Stage 3: Solution-aware — "how does the AI help?"
    {
      "@type": "Question",
      "name": "How does Scriber AI help me land more interviews?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Scriber AI analyzes thousands of successful resumes to suggest the exact keywords, phrasing, and achievements that get noticed. Our AI writes your bullet points, scores your ATS compatibility in real time, and provides recruiter-approved templates — so you stop guessing and start landing interviews.",
      },
    },
    // Stage 3: Solution-aware — ATS pass
    {
      "@type": "Question",
      "name": "Will my resume pass ATS screening software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes. Every Scriber AI template is engineered to pass Applicant Tracking Systems. Our AI scores your resume's ATS compatibility and suggests targeted improvements — ensuring recruiters actually see your application.",
      },
    },
    // Stage 3: Differentiator
    {
      "@type": "Question",
      "name": "What makes Scriber AI different from other resume builders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Scriber AI combines AI-powered content suggestions with recruiter-approved templates in one seamless workflow. Unlike generic builders, our system analyzes your experience and surfaces quantified achievements that hiring managers actually want to see — no design skills required.",
      },
    },
    // Stage 4: Ready-to-hire — time to value
    {
      "@type": "Question",
      "name": "How long does it take to build a resume with Scriber AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Most users create a professional, ATS-optimized resume in under 15 minutes. Our AI suggestions help you write compelling bullet points instantly, so you spend less time staring at a blank page and more time applying.",
      },
    },
    // Stage 4: Ready-to-hire — download/export
    {
      "@type": "Question",
      "name": "Can I download my resume as a PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes. Download unlimited PDFs on the Pro plan. Free users can download one resume. All downloads are print-ready and maintain perfect formatting across all devices and ATS systems.",
      },
    },
    // Stage 4: Ready-to-hire — templates
    {
      "@type": "Question",
      "name": "How many resume templates are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Scriber AI offers 18+ professional resume templates across categories including Modern, Creative, Executive, and Minimalist. Each template is designed by recruitment experts to highlight your strengths and pass ATS filters.",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />
      <main className="flex-grow">
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />

        {/* Pain Point Section - Emotional Copy */}
        <section className="py-24 md:py-32 bg-surface-subtle">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-red-50 text-red-600 font-label-sm rounded-full border border-red-100">
                Sound familiar?
              </span>
              <h2 className="font-display-lg text-on-surface mb-4">
                Tired of sending resumes that never get a response?
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                You&apos;re qualified. You&apos;re experienced. But your resume gets lost in the void.
                Meanwhile, less qualified candidates are landing interviews because they know
                how to play the ATS game.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-surface-variant">
                <div className="text-3xl mb-4">😤</div>
                <h3 className="font-title-lg text-on-surface mb-2">Zero callbacks</h3>
                <p className="font-body-md text-on-surface-variant">
                  You&apos;ve sent 50+ applications and heard back from exactly zero companies.
                  The silence is deafening.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-surface-variant">
                <div className="text-3xl mb-4">😰</div>
                <h3 className="font-title-lg text-on-surface mb-2">ATS rejection</h3>
                <p className="font-body-md text-on-surface-variant">
                  Your beautifully designed resume gets auto-rejected by robots before
                  a human ever sees it.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-surface-variant">
                <div className="text-3xl mb-4">🤯</div>
                <h3 className="font-title-lg text-on-surface mb-2">Resume writer&apos;s block</h3>
                <p className="font-body-md text-on-surface-variant">
                  Staring at a blank page, struggling to describe your achievements
                  without sounding like everyone else.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section - Outcome-Focused */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-emerald-50 text-emerald-600 font-label-sm rounded-full border border-emerald-100">
                The solution
              </span>
              <h2 className="font-display-lg text-on-surface mb-4">
                Land 3x more interviews with an ATS-optimized resume
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                Our AI analyzes thousands of successful resumes to suggest the exact
                words, achievements, and keywords that get you noticed. Stop guessing.
                Start landing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-on-surface mb-1">AI writes your bullet points</h3>
                    <p className="font-body-md text-on-surface-variant">
                      Describe your role in plain language. Our AI transforms it into
                      quantified achievements hiring managers actually want to see.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-on-surface mb-1">ATS score in real-time</h3>
                    <p className="font-body-md text-on-surface-variant">
                      See exactly how your resume performs against Applicant Tracking Systems
                      before you send it. Fix issues instantly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-on-surface mb-1">Recruiter-approved templates</h3>
                    <p className="font-body-md text-on-surface-variant">
                      18+ templates designed by people who actually hire. Not designers
                      who&apos;ve never reviewed a resume.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-950 rounded-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">98/100</div>
                  <div className="text-sm text-white/60">ATS Compatibility Score</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Keywords matched</span>
                    <span className="text-emerald-400 font-semibold">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Formatting score</span>
                    <span className="text-emerald-400 font-semibold">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Readability</span>
                    <span className="text-emerald-400 font-semibold">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Numbers */}
        <section className="py-16 bg-surface-container-low border-y border-surface-variant">
          <div className="max-w-[1200px] mx-auto px-4 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-display-xl text-primary mb-2">5M+</div>
                <div className="font-label-lg text-on-surface-variant">Resumes Created</div>
              </div>
              <div>
                <div className="font-display-xl text-primary mb-2">73%</div>
                <div className="font-label-lg text-on-surface-variant">More Interview Callbacks</div>
              </div>
              <div>
                <div className="font-display-xl text-primary mb-2">4.9/5</div>
                <div className="font-label-lg text-on-surface-variant">User Rating</div>
              </div>
              <div>
                <div className="font-display-xl text-primary mb-2">&lt;15min</div>
                <div className="font-label-lg text-on-surface-variant">Average Build Time</div>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />

        {/* FAQ Section - Local Search Intent */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-[800px] mx-auto px-4 md:px-10">
            <div className="text-center mb-12">
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-surface-container text-on-surface font-label-sm rounded-full border border-surface-variant">
                Common Questions
              </span>
              <h2 className="font-display-lg text-on-surface">
                Frequently asked questions
              </h2>
            </div>

            {/* FAQ items ordered by buyer awareness stage (Prompt 16) */}
            <div className="space-y-4">
              {/* Stage 2: Problem-aware */}
              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  Why do most resumes get rejected before a human reads them?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Over 75% of resumes are filtered out by Applicant Tracking Systems (ATS)
                  before a recruiter ever sees them. ATS software scans for specific keywords,
                  formatting patterns, and section structure. Resumes with tables, graphics, or
                  missing keywords get auto-rejected. Scriber AI is purpose-built to pass these filters.
                </div>
              </details>

              {/* Stage 3: Solution-aware */}
              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  How does Scriber AI help me land more interviews?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Our AI resume builder analyzes thousands of successful resumes to suggest the exact
                  keywords, phrasing, and achievements that get noticed. It writes your bullet points,
                  scores your ATS compatibility in real time, and provides recruiter-approved templates —
                  so you stop guessing and start landing interviews.
                </div>
              </details>

              {/* Stage 3: Solution-aware — ATS */}
              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  Will my resume pass ATS screening software?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Yes. Every Scriber AI template is engineered to pass Applicant Tracking Systems.
                  Our AI scores your resume&apos;s ATS compatibility and suggests targeted
                  improvements — ensuring recruiters actually see your application.
                </div>
              </details>

              {/* Stage 3: Differentiator */}
              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  What makes Scriber AI different from other resume builders?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Scriber AI combines AI-powered content suggestions with recruiter-approved
                  templates in one seamless workflow. Unlike generic builders, our system analyzes
                  your experience and surfaces quantified achievements that hiring managers actually
                  want to see — no design skills required.
                </div>
              </details>

              {/* Stage 4: Ready-to-hire — time to value */}
              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  How long does it take to build a resume with Scriber AI?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Most users create a professional, ATS-optimized resume in under 15 minutes.
                  Our AI suggestions help you write compelling bullet points instantly, so you
                  spend less time staring at a blank page and more time applying.
                </div>
              </details>

              {/* Stage 4: Ready-to-hire — export */}
              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  Can I download my resume as a PDF?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Yes. Download unlimited PDFs on the Pro plan. Free users can download one
                  resume. All downloads are print-ready and maintain perfect formatting across
                  all devices and ATS systems.
                </div>
              </details>

              {/* Stage 4: Ready-to-hire — templates */}
              <details className="group border border-surface-variant rounded-xl overflow-hidden">
                <summary className="px-6 py-4 font-title-lg text-on-surface cursor-pointer hover:bg-surface-subtle transition-colors list-none flex justify-between items-center">
                  How many resume templates are available?
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-6 pb-4 font-body-md text-on-surface-variant">
                  Scriber AI offers 18+ professional resume templates across categories like
                  Modern, Creative, Executive, and Minimalist. Each template is designed by
                  recruitment experts to highlight your strengths and pass ATS filters.
                </div>
              </details>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}

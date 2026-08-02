import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageClient, type LegalSection } from "@/components/legal/legal-page-client";

export const metadata: Metadata = {
  title: "Privacy Policy | Scriber AI",
  description:
    "Scriber AI Privacy Policy — how we collect, use, and protect your personal data when you use our free AI resume builder. We never sell your data. GDPR and CCPA compliant.",
  openGraph: {
    title: "Privacy Policy | Scriber AI Resume Builder",
    description:
      "Scriber AI's commitment to your privacy. We collect only what's needed to power your resume — and never sell it.",
    url: "https://scriber.ai/privacy",
  },
  alternates: { canonical: "https://scriber.ai/privacy" },
  robots: { index: true, follow: true },
};

const privacySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Scriber AI Privacy Policy",
  url: "https://scriber.ai/privacy",
  description:
    "Privacy Policy describing how Scriber AI collects, uses, and protects personal data from users of the AI resume builder.",
  dateModified: "2026-08-01",
  publisher: { "@type": "Organization", name: "Scriber AI", url: "https://scriber.ai" },
};

const sections: LegalSection[] = [
  {
    id: "overview",
    title: "1. Overview",
    content: [
      `Scriber AI ("we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered resume builder at scriber.ai ("the Service").`,
      `Please read this policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.`,
    ],
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    content: [
      `**Account information:** When you register, we collect your name, email address, and password (stored as a cryptographic hash — we never store your plain-text password).`,
      `**Resume content:** Work history, education, skills, and other information you enter into the resume builder. This data is stored securely to let you access your resumes across devices.`,
      `**Usage data:** Pages visited, features used, time spent, and interactions with our AI suggestions. This helps us improve the product.`,
      `**Payment information:** If you subscribe to our Pro plan, payment is processed by Stripe. We receive only a payment confirmation — we never see or store your card number.`,
      `**Communications:** If you contact us, we retain your name, email, and message to respond to your inquiry.`,
    ],
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: [
      `We use the information we collect to:`,
      `(a) Provide, operate, and maintain the Service — including saving your resumes and powering AI suggestions.`,
      `(b) Improve and personalize the Service based on how you use it.`,
      `(c) Process payments and manage your subscription.`,
      `(d) Communicate with you about your account, respond to support requests, and send product updates (you can opt out of marketing emails at any time).`,
      `(e) Monitor usage to detect, prevent, and respond to fraud or security issues.`,
      `(f) Comply with legal obligations.`,
    ],
  },
  {
    id: "ai-data",
    title: "4. How We Handle AI Processing",
    content: [
      `When you request AI-powered resume suggestions, your resume text is sent to our AI system for processing. We use this data solely to generate suggestions for you — we do not use your personal resume content to train our AI models without explicit consent.`,
      `AI-generated content is suggestions only. You remain fully responsible for reviewing, editing, and verifying any content in your final resume.`,
    ],
  },
  {
    id: "sharing",
    title: "5. Sharing Your Information",
    content: [
      `We do not sell, trade, or rent your personal information to third parties.`,
      `We may share your information with:`,
      `**Service providers:** Third-party vendors who help us operate the Service (e.g., cloud hosting, payment processing, email delivery). These providers are contractually obligated to keep your data confidential.`,
      `**Legal requirements:** We may disclose your information if required by law, court order, or government authority.`,
      `**Business transfers:** If Scriber AI is acquired or merges with another company, your information may be transferred. We will notify you before your personal information becomes subject to a different privacy policy.`,
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies & Tracking",
    content: [
      `We use cookies and similar tracking technologies to:`,
      `(a) Keep you logged in to your account.`,
      `(b) Understand how users navigate the Service (anonymous analytics).`,
      `(c) Remember your preferences.`,
      `You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of the Service may not function properly if cookies are disabled.`,
      `We do not use third-party advertising cookies.`,
    ],
  },
  {
    id: "retention",
    title: "7. Data Retention",
    content: [
      `We retain your account data for as long as your account is active or as needed to provide the Service. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal reasons.`,
      `Resume content is retained until you delete it from the Service or delete your account.`,
    ],
  },
  {
    id: "security",
    title: "8. Data Security",
    content: [
      `We implement industry-standard security measures to protect your information, including:`,
      `(a) Encryption in transit (TLS/HTTPS) for all data sent between your browser and our servers.`,
      `(b) Encrypted storage for sensitive account information.`,
      `(c) Access controls limiting which employees can access personal data.`,
      `No method of electronic storage or transmission is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.`,
    ],
  },
  {
    id: "rights",
    title: "9. Your Rights",
    content: [
      `Depending on your location, you may have the following rights regarding your personal data:`,
      `**Access:** Request a copy of the personal data we hold about you.`,
      `**Correction:** Ask us to correct inaccurate or incomplete data.`,
      `**Deletion:** Request that we delete your personal data (subject to certain exceptions).`,
      `**Portability:** Receive your data in a structured, machine-readable format.`,
      `**Opt-out:** Opt out of marketing communications at any time by clicking "unsubscribe" in any email we send.`,
      `To exercise these rights, contact us at hello@scriber.ai. We will respond within 30 days.`,
    ],
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: [
      `The Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will delete that information promptly.`,
    ],
  },
  {
    id: "gdpr",
    title: "11. GDPR & CCPA",
    content: [
      `**GDPR (EU/EEA users):** If you are located in the European Union or European Economic Area, you have rights under the General Data Protection Regulation. Our lawful bases for processing include: performance of our contract with you, our legitimate interests in operating and improving the Service, and your consent for marketing communications.`,
      `**CCPA (California residents):** California residents have the right to know what personal information we collect, to request deletion, and to opt out of the sale of personal information. We do not sell personal information.`,
    ],
  },
  {
    id: "changes-privacy",
    title: "12. Changes to This Policy",
    content: [
      `We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page with an updated "last modified" date, and by sending an email notification to registered users.`,
      `Your continued use of the Service after changes are posted constitutes your acceptance of the updated policy.`,
    ],
  },
  {
    id: "contact-privacy",
    title: "13. Contact Us",
    content: [
      `For privacy-related questions or to exercise your rights, please contact our privacy team:`,
      `Email: hello@scriber.ai`,
      `We aim to respond to all privacy inquiries within 30 days.`,
    ],
  },
];

const PrivacyBadge = () => (
  <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
    <span className="material-symbols-outlined text-emerald-600 text-[22px] fill">
      verified_user
    </span>
    <span className="font-label-lg text-emerald-700">
      We never sell your data — ever.
    </span>
  </div>
);

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <LegalPageClient
        badge="Legal"
        title="Privacy Policy"
        lastUpdated="August 1, 2026"
        lastUpdatedIso="2026-08-01"
        subtitle="We take your privacy seriously. This policy explains exactly what data we collect, why we collect it, and how we protect it — in plain English."
        sections={sections}
        headerExtra={<PrivacyBadge />}
        footerLinks={
          <>
            <p className="font-body-md text-on-surface-variant">
              Have questions about how we handle your data?{" "}
              <Link href="/contact" className="text-primary hover:underline underline-offset-4">
                Contact our privacy team
              </Link>
              .
            </p>
            <p className="font-body-md text-on-surface-variant">
              Also see our{" "}
              <Link href="/terms" className="text-primary hover:underline underline-offset-4">
                Terms of Service
              </Link>
              .
            </p>
          </>
        }
      />
    </>
  );
}

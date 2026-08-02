import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageClient, type LegalSection } from "@/components/legal/legal-page-client";

export const metadata: Metadata = {
  title: "Terms of Service | Scriber AI",
  description:
    "Read the Scriber AI Terms of Service. By using our free AI resume builder, you agree to these terms. Covers account use, intellectual property, payments, and limitations of liability.",
  openGraph: {
    title: "Terms of Service | Scriber AI Resume Builder",
    description:
      "Terms governing your use of Scriber AI — the free AI-powered resume builder. Last updated August 2026.",
    url: "https://scriber.ai/terms",
  },
  alternates: { canonical: "https://scriber.ai/terms" },
  robots: { index: true, follow: true },
};

const termsSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Scriber AI Terms of Service",
  url: "https://scriber.ai/terms",
  description: "Terms of Service for Scriber AI, the AI-powered resume builder.",
  dateModified: "2026-08-01",
  publisher: { "@type": "Organization", name: "Scriber AI", url: "https://scriber.ai" },
};

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      `By accessing or using Scriber AI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all the terms and conditions of this agreement, then you may not access or use the Service.`,
      `These Terms apply to all visitors, users, and others who access or use the Service, including users who create an account ("Account").`,
    ],
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: [
      `Scriber AI provides an AI-powered resume building platform that allows users to create, edit, and download professional resumes using artificial intelligence suggestions and pre-designed templates ("the Service").`,
      `We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We shall not be liable to you or any third party for any such modification, suspension, or discontinuation.`,
    ],
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: [
      `When you create an Account, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your Account.`,
      `You agree to notify us immediately at hello@scriber.ai of any unauthorized use of your Account or any other breach of security. Scriber AI will not be liable for any loss or damage arising from your failure to comply with this section.`,
      `You may not use as a username the name of another person or entity, or a name that is not lawfully available for use, or a name that is offensive, vulgar, or obscene.`,
    ],
  },
  {
    id: "ip",
    title: "4. Intellectual Property",
    content: [
      `The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Scriber AI and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Scriber AI.`,
      `Content you create using the Service — including your resume text, work history, and other personal content — remains your property. You grant Scriber AI a limited, non-exclusive license to store and process your content solely to provide the Service.`,
      `AI-generated suggestions are produced by our system and provided to you as a starting point. You are responsible for reviewing, editing, and ensuring the accuracy of any AI-generated content before use.`,
    ],
  },
  {
    id: "payments",
    title: "5. Payments and Subscriptions",
    content: [
      `Certain features of the Service are available on a paid subscription basis ("Pro Plan"). By subscribing to a paid plan, you agree to pay the applicable fees as described on our Pricing page.`,
      `All payments are processed securely by Stripe. Scriber AI does not store your payment card details. Subscriptions are billed on a monthly basis and renew automatically unless cancelled.`,
      `You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. We do not provide refunds for partial months.`,
      `We reserve the right to change our pricing at any time with at least 30 days' notice to existing subscribers.`,
    ],
  },
  {
    id: "prohibited",
    title: "6. Prohibited Activities",
    content: [
      `You agree not to engage in any of the following activities:`,
      `(a) Using the Service for any unlawful purpose or in violation of any applicable laws or regulations.`,
      `(b) Attempting to gain unauthorized access to any portion of the Service or any other systems or networks connected to the Service.`,
      `(c) Using automated scripts, bots, or scraping tools to access, collect, or extract data from the Service.`,
      `(d) Impersonating any person or entity, or misrepresenting your affiliation with any person or entity.`,
      `(e) Using the Service to create false, misleading, or fraudulent resume content intended to deceive employers.`,
      `(f) Reverse engineering, decompiling, or disassembling any aspect of the Service.`,
    ],
  },
  {
    id: "privacy",
    title: "7. Privacy",
    content: [
      `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy at scriber.ai/privacy to understand our practices.`,
    ],
  },
  {
    id: "disclaimer",
    title: "8. Disclaimer of Warranties",
    content: [
      `The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied. Scriber AI does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.`,
      `Scriber AI does not guarantee that use of our resume builder will result in job interviews, job offers, or employment. Results depend on many factors outside our control, including employer requirements, market conditions, and individual qualifications.`,
    ],
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: [
      `To the maximum extent permitted by applicable law, Scriber AI and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.`,
      `Our total liability to you for any claims arising from or relating to these Terms or your use of the Service shall not exceed the amount you paid to us in the twelve months preceding the claim.`,
    ],
  },
  {
    id: "changes",
    title: "10. Changes to Terms",
    content: [
      `We reserve the right to update or modify these Terms at any time. We will notify you of material changes by posting a notice on the Service or by sending an email to the address associated with your Account.`,
      `Your continued use of the Service after any changes to the Terms constitutes your acceptance of the new Terms. If you do not agree to the new Terms, you must stop using the Service.`,
    ],
  },
  {
    id: "governing",
    title: "11. Governing Law",
    content: [
      `These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.`,
      `Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Delaware.`,
    ],
  },
  {
    id: "contact-terms",
    title: "12. Contact Us",
    content: [
      `If you have any questions about these Terms, please contact us:`,
      `Email: hello@scriber.ai`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />
      <LegalPageClient
        badge="Legal"
        title="Terms of Service"
        lastUpdated="August 1, 2026"
        lastUpdatedIso="2026-08-01"
        subtitle="Please read these Terms carefully before using Scriber AI. They govern your use of our free AI resume builder and all related services."
        sections={sections}
        footerLinks={
          <p className="font-body-md text-on-surface-variant">
            Have questions about these terms?{" "}
            <Link href="/contact" className="text-primary hover:underline underline-offset-4">
              Contact us
            </Link>{" "}
            and we&apos;ll be happy to explain anything. Also see our{" "}
            <Link href="/privacy" className="text-primary hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        }
      />
    </>
  );
}

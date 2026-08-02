import type { Metadata } from "next";
import ContactClient from "./_contact-client";

export const metadata: Metadata = {
  title: "Contact Us | Scriber AI Support & Inquiries",
  description:
    "Get in touch with the Scriber AI team. We respond to all messages within 1–2 business days. Questions about your resume, billing, or partnership opportunities — we'd love to hear from you.",
  openGraph: {
    title: "Contact Scriber AI | AI Resume Builder Support",
    description:
      "Reach the Scriber AI team for support, billing questions, feature requests, or partnership inquiries. Response within 1–2 business days.",
    url: "https://scriber.ai/contact",
  },
  alternates: {
    canonical: "https://scriber.ai/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

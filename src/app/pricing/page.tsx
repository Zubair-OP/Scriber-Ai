import type { Metadata } from "next";
import PricingPageClient from "./_pricing-client";

// Pricing page metadata (Prompt 7 — conversion-focused variant, Prompt 11 — page-level spec)
export const metadata: Metadata = {
  title: "Pricing | Free & Pro AI Resume Builder Plans",
  description:
    "Start free with Scriber AI — no credit card required. Upgrade to Pro for unlimited AI resume suggestions, 18+ premium templates, and PDF downloads. Land your dream job faster.",
  openGraph: {
    title: "Scriber AI Pricing | Free AI Resume Builder & Pro Plans",
    description:
      "Compare Scriber AI plans. Start free, upgrade to Pro for unlimited AI suggestions and premium templates. No hidden fees.",
    url: "https://scriber.ai/pricing",
  },
  alternates: {
    canonical: "https://scriber.ai/pricing",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}

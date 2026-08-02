import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "@/hooks/useSession";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scriber.ai"),
  title: {
    default: "Scriber AI | AI Resume Builder — Land 3x More Interviews",
    template: "%s | Scriber AI",
  },
  description:
    "Scriber AI is the best free AI resume builder. Create an ATS-optimized, recruiter-approved resume in under 15 minutes. Used by 5M+ job seekers. No credit card required.",
  keywords: [
    "AI resume builder",
    "free resume builder",
    "ATS resume builder",
    "ATS resume checker",
    "resume maker",
    "online resume builder",
    "professional resume templates",
    "best resume builder 2025",
    "resume builder no credit card",
    "CV builder online",
    "AI-powered resume",
    "job application resume",
    "resume builder for free download",
    "resume builder ATS optimized",
  ],
  authors: [{ name: "Scriber AI", url: "https://scriber.ai" }],
  creator: "Scriber AI",
  publisher: "Scriber AI",
  applicationName: "Scriber AI",
  openGraph: {
    title: "Scriber AI | AI Resume Builder — Land 3x More Interviews",
    description:
      "Scriber AI is the best free AI resume builder. Create an ATS-optimized resume in under 5 minutes. 5M+ job seekers trust Scriber AI.",
    url: "https://scriber.ai",
    siteName: "Scriber AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@scriberAI",
    title: "Scriber AI | AI Resume Builder — Land 3x More Interviews",
    description:
      "Build an ATS-optimized resume in under 15 minutes with AI-powered suggestions. Free to start — no credit card required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://scriber.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geist.variable} bg-background text-on-surface font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

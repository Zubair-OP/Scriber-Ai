"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/home/sections/site-header";
import { SiteFooter } from "@/components/home/sections/site-footer";

// Contact page metadata is exported from the server wrapper (contact/page.tsx)

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
}

const STORAGE_KEY = "scriber_contact_messages";

function saveToLocalStorage(data: Omit<ContactMessage, "id" | "sentAt">): ContactMessage {
  const existing: ContactMessage[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );
  const entry: ContactMessage = {
    ...data,
    id: `msg_${Date.now()}`,
    sentAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
  return entry;
}

const faqs = [
  {
    q: "How quickly do you respond?",
    a: "We aim to reply to all inquiries within 1–2 business days. For urgent billing issues, please mention 'URGENT' in your subject line.",
  },
  {
    q: "I have a billing question. Who do I contact?",
    a: "Use the contact form and select 'Billing & Payments' as your subject. Include your account email so we can pull up your record quickly.",
  },
  {
    q: "Can I request a feature?",
    a: "Absolutely — we love hearing from users. Select 'Feature Request' in the subject dropdown and describe what you'd like to see. Popular requests go straight into our roadmap.",
  },
  {
    q: "I found a bug. Where do I report it?",
    a: "Select 'Bug Report' in the subject and include: the browser you're using, the steps to reproduce, and a screenshot if possible. We'll investigate and follow up.",
  },
  {
    q: "Is there a help center I can check first?",
    a: "Yes — many common questions are answered in our Help Center. Check there before reaching out; you may get an instant answer.",
  },
];

const SUBJECTS = [
  "General Inquiry",
  "Billing & Payments",
  "Feature Request",
  "Bug Report",
  "Partnership",
  "Press & Media",
  "Other",
];

export default function ContactClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");

    // Simulate network delay, then save to localStorage
    setTimeout(() => {
      try {
        saveToLocalStorage(form);
        setStatus("sent");
        setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
      } catch {
        setStatus("error");
      }
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <SiteHeader />

      <main className="flex-grow">
        {/* ── Hero ── */}
        <section className="pt-32 pb-16 px-4 md:px-10 bg-surface relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          </div>
          <div className="max-w-[760px] mx-auto text-center relative z-10">
            <span className="inline-flex items-center px-3 py-1 mb-5 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
              Get in touch
            </span>
            <h1 className="font-display-xl text-on-surface mb-5">
              We&apos;d love to hear from you
            </h1>
            <p className="font-body-lg text-on-surface-variant">
              Whether you have a question about your resume, a billing issue, or just want to
              say hi — drop us a message. We read every single one.
            </p>
          </div>
        </section>

        {/* ── Contact form + Info ── */}
        <section className="py-16 md:py-24 px-4 md:px-10">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left: contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-headline-md text-on-surface mb-6">Contact information</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-secondary-container/60 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                      <span className="material-symbols-outlined text-[22px]">mail</span>
                    </div>
                    <div>
                      <p className="font-title-md text-on-surface mb-0.5">Email us</p>
                      <a
                        href="mailto:hello@scriber.ai"
                        className="font-body-md text-primary hover:underline underline-offset-4"
                      >
                        hello@scriber.ai
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-secondary-container/60 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                      <span className="material-symbols-outlined text-[22px]">schedule</span>
                    </div>
                    <div>
                      <p className="font-title-md text-on-surface mb-0.5">Response time</p>
                      <p className="font-body-md text-on-surface-variant">
                        Within 1–2 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-secondary-container/60 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                      <span className="material-symbols-outlined text-[22px]">public</span>
                    </div>
                    <div>
                      <p className="font-title-md text-on-surface mb-0.5">Support hours</p>
                      <p className="font-body-md text-on-surface-variant">
                        Monday–Friday, 9am–6pm EST
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-1.5 bg-white/50 backdrop-blur-sm rounded-[1.25rem] border border-surface-variant/40">
                <div className="bg-white rounded-[1rem] p-6 border border-surface-variant/20">
                  <h3 className="font-title-lg text-on-surface mb-3">Looking for quick answers?</h3>
                  <p className="font-body-md text-on-surface-variant mb-4">
                    Check our Help Center — most common questions are answered there instantly.
                  </p>
                  <Link
                    href="#faq"
                    className="inline-flex items-center gap-2 text-primary font-label-lg hover:underline underline-offset-4"
                  >
                    <span className="material-symbols-outlined text-[18px]">help</span>
                    Browse FAQ below
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="lg:col-span-3">
              <div className="p-1.5 bg-white/50 backdrop-blur-sm rounded-[1.5rem] border border-surface-variant/40">
                <div className="bg-white rounded-[1.25rem] p-8 border border-surface-variant/20">
                  {status === "sent" ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <span className="material-symbols-outlined text-emerald-600 text-4xl fill">
                          check_circle
                        </span>
                      </div>
                      <h3 className="font-headline-md text-on-surface mb-3">
                        Message sent!
                      </h3>
                      <p className="font-body-lg text-on-surface-variant mb-6">
                        Thanks for reaching out. We&apos;ve received your message and will
                        reply within 1–2 business days.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        className="border border-outline/30 text-on-surface-variant px-6 py-2.5 rounded-full font-title-md hover:bg-surface-container transition-all text-sm"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      <h2 className="font-headline-md text-on-surface mb-2">
                        Send us a message
                      </h2>
                      <p className="font-body-md text-on-surface-variant mb-6">
                        Your message is saved locally and we&apos;ll follow up by email.
                      </p>

                      {/* Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block font-label-lg text-on-surface mb-1.5"
                          >
                            Full name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Jane Smith"
                            className="w-full border border-surface-variant rounded-xl px-4 py-2.5 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-surface"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block font-label-lg text-on-surface mb-1.5"
                          >
                            Email address <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="jane@company.com"
                            className="w-full border border-surface-variant rounded-xl px-4 py-2.5 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-surface"
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="contact-subject"
                          className="block font-label-lg text-on-surface mb-1.5"
                        >
                          Subject
                        </label>
                        <select
                          id="contact-subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full border border-surface-variant rounded-xl px-4 py-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-surface appearance-none"
                        >
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block font-label-lg text-on-surface mb-1.5"
                        >
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help..."
                          className="w-full border border-surface-variant rounded-xl px-4 py-2.5 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-surface resize-none"
                        />
                      </div>

                      {status === "error" && (
                        <p className="text-sm text-red-600">
                          Something went wrong. Please try again.
                        </p>
                      )}

                      <button
                        id="contact-submit-btn"
                        type="submit"
                        disabled={status === "sending" || !form.name || !form.email || !form.message}
                        className="w-full bg-primary-container text-white py-3.5 rounded-full font-title-md hover:bg-primary active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {status === "sending" ? (
                          <>
                            <span className="material-symbols-outlined text-[18px] animate-spin">
                              progress_activity
                            </span>
                            Sending…
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">send</span>
                            Send message
                          </>
                        )}
                      </button>

                      <p className="font-label-sm text-on-surface-variant text-center">
                        By submitting, you agree to our{" "}
                        <Link href="/privacy" className="text-primary hover:underline underline-offset-4">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-24 md:py-32 px-4 md:px-10 bg-surface-container-low">
          <div className="max-w-[760px] mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center px-3 py-1 mb-4 bg-primary/5 text-primary font-label-sm rounded-full border border-primary/10">
                FAQ
              </span>
              <h2 className="font-display-lg text-on-surface mb-4">
                Common questions before you write
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                You might already have your answer here.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-surface-variant rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 font-title-lg text-on-surface text-left cursor-pointer hover:bg-surface-subtle transition-colors flex justify-between items-center"
                  >
                    {item.q}
                    <span
                      className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 flex-shrink-0 ml-3 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    hidden={openFaq !== i}
                    className="px-6 pb-4 font-body-md text-on-surface-variant leading-relaxed"
                  >
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordApi } from "@/apis/auth.api";
import { LogoIcon } from "@/components/home/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devResetLink, setDevResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setDevResetLink("");

    try {
      const response = await forgotPasswordApi({ email });
      setMessage(response?.message || "If the account exists, a reset link has been generated.");

      const resetToken = response?.data?.resetToken;
      if (resetToken) {
        setDevResetLink(`/reset-password?token=${encodeURIComponent(resetToken)}`);
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const resErr = err as { response?: { data?: { message?: string } } };
        setError(resErr.response?.data?.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-screen overflow-hidden bg-surface-subtle text-on-surface font-sans flex">
      <div className="w-full lg:w-[460px] xl:w-[500px] flex-shrink-0 min-h-[100dvh] flex flex-col justify-center px-6 sm:px-10 lg:px-12 bg-white border-r border-surface-variant relative z-10 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-sm mx-auto my-auto py-6">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <LogoIcon className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold text-primary tracking-tight">
              Scriber Builder
            </h1>
          </Link>

          <h2 className="text-2xl font-bold mb-1 text-on-surface">Forgot your password?</h2>
          <p className="text-sm text-on-surface-variant mb-8">
            Enter the email tied to your account and we&apos;ll generate a reset link for you.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex flex-col gap-2">
              <span>{message}</span>
              {devResetLink && (
                <Link href={devResetLink} className="font-semibold underline">
                  Continue to reset password (dev only)
                </Link>
              )}
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-surface-variant rounded-xl bg-surface-subtle placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container focus:bg-white transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary-container text-white text-sm font-semibold rounded-xl hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-all disabled:opacity-50 mt-4"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-primary-container hover:text-primary transition-colors">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block relative flex-1 min-h-[100dvh] bg-surface-container overflow-hidden">
        <div
          className="absolute inset-0 h-full w-full object-cover bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAk7gJi56VTCVM0gx3uUmED8dcn-fZVjZOeBF9dtn2H65J8DvfL1E8hiXg61zcrN7FEAji3cph2nsQyzfqT9qD8XvJL-1U19uG84jroT2uRuV39HWPxv9DZ-R_vztAvoSJfVqvNvJrSNfE7PWMZxYB0wHhqk9s6hCDI-6ifWuB4XpYb6_h2VE_eD-OSnOTSFFGf6Sd7Rom_3vO0DVTWSnaBxZlCGW-DHtXiLFeaVhICyX19xV1TNmE50iSQUeKiTm818jzwrU3Tfih6')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent mix-blend-multiply opacity-75"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl max-w-lg">
            <h2 className="text-xl font-bold mb-2 leading-tight text-white">
              Build a resume that stands out.
            </h2>
            <p className="text-sm opacity-90 leading-relaxed text-white/90">
              Join thousands of professionals who have advanced their careers with our modern, structured resume builder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

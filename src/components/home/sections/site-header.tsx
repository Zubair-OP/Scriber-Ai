"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { LogoIcon } from "@/components/home/ui";
import { useSession } from "@/hooks/useSession";
import { logoutApi } from "@/apis/auth.api";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/testimonials", label: "Testimonials" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, refetch } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleLogout = async () => {
    await logoutApi();
    await refetch();
    setMobileOpen(false);
    router.push("/login");
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-3 left-0 right-0 z-50 flex flex-col items-center px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-surface-variant/60 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center gap-1 px-2 py-1.5 w-full max-w-[800px]">
        {/* Brand */}
        <Link
          href="/"
          className="text-sm font-semibold text-primary flex items-center gap-2 tracking-tight pl-3 pr-4"
        >
          <LogoIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Scriber</span>
        </Link>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex gap-0.5 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                isActive(link.href)
                  ? "bg-surface text-on-surface"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-auto">
          {loading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                className={`hidden sm:inline-flex text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                  isActive("/dashboard")
                    ? "bg-surface text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle"
                }`}
              >
                Your Resumes
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-primary-container text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary active:scale-[0.98] transition-all"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle px-3 py-1.5 rounded-full transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-primary-container text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                <span>Build Resume</span>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </>
          )}

          {/* Mobile nav toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-on-surface-variant hover:bg-surface-subtle transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden mt-2 w-full max-w-[800px] bg-white/95 backdrop-blur-xl border border-surface-variant/60 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-2 flex flex-col gap-0.5"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium px-4 py-2.5 rounded-xl transition-colors ${
                  isActive(link.href)
                    ? "bg-surface text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-1 border-t border-surface-variant/60 sm:hidden" />
            {!loading && (
              user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="sm:hidden text-sm font-medium px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle transition-colors"
                >
                  Resumes
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="sm:hidden text-sm font-medium px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle transition-colors"
                >
                  Log In
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

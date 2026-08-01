"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentSessionApi } from "@/apis/auth.api";
import { hasProAccess } from "@/lib/plan-limits";

export interface SessionUser {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  plan: "free" | "pro" | "enterprise";
  subscriptionStatus?: string;
  currentPeriodEnd?: string;
}

interface SessionContextValue {
  user: SessionUser | null;
  loading: boolean;
  isPro: boolean;
  refetch: () => Promise<SessionUser | null>;
  setUser: (user: SessionUser | null) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Fetches the session once at the app root and shares it via context, so
 * client-side navigation between pages (each of which renders its own
 * <SiteHeader />) doesn't re-fetch /api/auth/me and flash a loading state
 * on every route change.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async (): Promise<SessionUser | null> => {
    try {
      const response = await getCurrentSessionApi();
      const sessionUser = response?.data?.user ?? null;
      setUser(sessionUser);
      return sessionUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchSession();
    })();
  }, [fetchSession]);

  const value: SessionContextValue = {
    user,
    loading,
    isPro: hasProAccess(user?.plan),
    refetch: fetchSession,
    setUser,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

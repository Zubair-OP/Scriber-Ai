"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentSessionApi } from "@/apis/auth.api";

export interface SessionUser {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  plan: "free" | "pro";
  subscriptionStatus?: string;
  currentPeriodEnd?: string;
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const response = await getCurrentSessionApi();
      setUser(response?.data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchSession();
    })();
  }, [fetchSession]);

  return { user, loading, isPro: user?.plan === "pro", refetch: fetchSession };
}

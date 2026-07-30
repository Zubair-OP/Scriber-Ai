export type PlanTier = "free" | "pro" | "enterprise";

export const RESUME_LIMITS: Record<PlanTier, number> = {
  free: 1,
  pro: 5,
  enterprise: Infinity,
};

export function getResumeLimit(plan?: string | null): number {
  return RESUME_LIMITS[(plan as PlanTier) ?? "free"] ?? RESUME_LIMITS.free;
}

export function hasProAccess(plan?: string | null): boolean {
  return plan === "pro" || plan === "enterprise";
}

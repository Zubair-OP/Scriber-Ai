import UserModel from "@/models/user.model";
import { hasProAccess } from "@/lib/plan-limits";

export class PlanRequiredError extends Error {
  constructor(message = "This feature requires a Pro plan") {
    super(message);
    this.name = "PlanRequiredError";
  }
}

export async function requireProPlan(userId: string): Promise<void> {
  const user = await UserModel.findById(userId).select("plan");

  if (!user || !hasProAccess(user.plan)) {
    throw new PlanRequiredError();
  }
}

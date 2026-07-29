import UserModel from "@/models/user.model";

export class PlanRequiredError extends Error {
  constructor(message = "This feature requires a Pro plan") {
    super(message);
    this.name = "PlanRequiredError";
  }
}

export async function requireProPlan(userId: string): Promise<void> {
  const user = await UserModel.findById(userId).select("plan");

  if (!user || user.plan !== "pro") {
    throw new PlanRequiredError();
  }
}

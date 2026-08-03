import { stripe } from "@/lib/stripe";
import UserModel from "@/models/user.model";

export async function activateProForUser(
  userId: string,
  opts: { customerId?: string; subscriptionId?: string; plan?: "pro" | "enterprise" }
) {
  let currentPeriodEnd: Date | undefined;

  if (opts.subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(opts.subscriptionId);
      const periodEnd = subscription.items?.data?.[0]?.current_period_end;
      if (periodEnd) {
        currentPeriodEnd = new Date(periodEnd * 1000);
      }
    } catch {
      // Best effort — the webhook (when reachable) will backfill this later.
    }
  }

  await UserModel.findByIdAndUpdate(userId, {
    ...(opts.customerId ? { stripeCustomerId: opts.customerId } : {}),
    ...(opts.subscriptionId ? { stripeSubscriptionId: opts.subscriptionId } : {}),
    plan: opts.plan || "pro",
    subscriptionStatus: "active",
    ...(currentPeriodEnd ? { currentPeriodEnd } : {}),
  });
}

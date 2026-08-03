import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { stripe } from "@/lib/stripe";
import { activateProForUser } from "@/lib/billing";

type StripeSubscriptionPayload = {
  id: string;
  customer: string | { id: string };
  metadata?: Record<string, string>;
  items?: { data?: Array<{ price?: { id?: string }; current_period_end?: number }> };
  status: string;
};

function determinePlanFromPriceId(priceId?: string): "pro" | "enterprise" {
  const enterprisePriceId = process.env.STRIPE_PRICE_ID_PREMIUM;
  if (enterprisePriceId && priceId === enterprisePriceId) return "enterprise";
  return "pro";
}

type StripeCheckoutSessionPayload = {
  client_reference_id?: string | null;
  metadata?: Record<string, string>;
  customer?: string | { id: string } | null;
  subscription?: string | { id: string } | null;
};

type StripeWebhookEvent = {
  type: string;
  data: {
    object: StripeCheckoutSessionPayload | StripeSubscriptionPayload;
  };
};

const updateUserFromSubscription = async (subscription: StripeSubscriptionPayload) => {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    return;
  }

  const currentPeriodEnd = subscription.items?.data?.[0]?.current_period_end;

  const subscriptionPriceId = subscription.items?.data?.[0]?.price?.id;
  const plan = determinePlanFromPriceId(subscriptionPriceId);

  await UserModel.findByIdAndUpdate(userId, {
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : undefined,
    plan: subscription.status === "active" ? plan : "free",
    subscriptionStatus: subscription.status === "active" ? "active" : subscription.status,
    currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
  });
};

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Webhook is not configured",
        },
        { status: 500 }
      );
    }

    const rawBody = await req.text();

    let event: StripeWebhookEvent;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret) as StripeWebhookEvent;
    } catch (error) {
      console.log("stripe webhook signature verification failed", error);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid signature",
        },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as StripeCheckoutSessionPayload;
      const userId = session.client_reference_id || session.metadata?.userId;

      if (userId) {
        const checkoutPlan = (session.metadata?.plan as "pro" | "enterprise") || "pro";
        await activateProForUser(userId, {
          customerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
          subscriptionId: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
          plan: checkoutPlan,
        });
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as StripeSubscriptionPayload;
      await updateUserFromSubscription(subscription);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Webhook processed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in stripe webhook api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
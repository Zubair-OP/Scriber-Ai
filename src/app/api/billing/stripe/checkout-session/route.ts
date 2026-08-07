import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import UserModel from "@/models/user.model";
import { StripeCheckoutBody } from "@/types/user.types";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();
    const body: StripeCheckoutBody = await req.json().catch(() => ({}));
    const plan = body.plan ?? "pro";

    if (plan !== "pro" && plan !== "enterprise") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unsupported plan",
        },
        { status: 400 }
      );
    }

    const priceMap: Record<string, string | undefined> = {
      pro: process.env.STRIPE_PRICE_ID_PRO,
      enterprise: process.env.STRIPE_PRICE_ID_PREMIUM,
    };

    const priceId = priceMap[plan];

    if (!priceId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Stripe price is not configured",
        },
        { status: 500 }
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer_email: user.email,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing?checkout=cancelled`,
        client_reference_id: userId,
        metadata: { userId, plan },
        subscription_data: {
          metadata: { userId, plan },
        },
      },
      // Bucketed to a short window so rapid double-submits are deduped without
      // pinning the user to a stale session on a later, legitimate retry.
      { idempotencyKey: `checkout-session-${userId}-${plan}-${Math.floor(Date.now() / 10_000)}` }
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Checkout session created successfully",
        data: {
          url: session.url,
          id: session.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("checkout-session error detail:", error);

    if (error instanceof Error) {
      const payload = error as unknown as { type?: string; raw?: { message?: string } };

      const message =
        payload?.raw?.message ||
        (error.name === "StripeInvalidRequestError" ? error.message : undefined);

      if (message) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: `Stripe: ${message}` },
          { status: 402 }
        );
      }
    }

    return handleApiError(error, "error in checkout session api");
  }
}
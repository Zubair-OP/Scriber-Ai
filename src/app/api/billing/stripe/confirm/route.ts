import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { handleApiError } from "@/lib/api-error";
import { activateProForUser } from "@/lib/billing";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();
    const body = await req.json().catch(() => ({}));
    const sessionId: string | undefined = body.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "sessionId is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const sessionUserId = session.client_reference_id || session.metadata?.userId;

    if (!sessionUserId || sessionUserId !== userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "This checkout session does not belong to you" },
        { status: 403 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Payment has not completed yet" },
        { status: 400 }
      );
    }

    await activateProForUser(userId, {
      customerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
      subscriptionId: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
    });

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Plan upgraded to Pro" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "error in stripe checkout confirm api");
  }
}

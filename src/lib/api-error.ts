import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { UnauthorizedError } from "@/lib/getCurrentUser";
import { PlanRequiredError } from "@/lib/plan";

export function handleApiError(error: unknown, logContext: string): NextResponse<ApiResponse> {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  if (error instanceof PlanRequiredError) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: error.message,
      },
      { status: 403 }
    );
  }

  console.error(logContext, error);

  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message: "Something went wrong",
    },
    { status: 500 }
  );
}

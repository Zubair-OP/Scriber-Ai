import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { UnauthorizedError } from "@/lib/getCurrentUser";
import { PlanRequiredError } from "@/lib/plan";
import { ValidationError } from "@/lib/resume-validation";
import { AiResponseError } from "@/lib/ai-json";

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

  if (error instanceof ValidationError) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }

  if (error instanceof AiResponseError) {
    console.error(logContext, error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: error.message,
      },
      { status: 502 }
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

import { NextResponse } from "next/server";

export async function parseJsonBody<T>(request: Request) {
  try {
    const body = (await request.json()) as T;

    return {
      success: true as const,
      data: body,
    };
  } catch {
    return {
      success: false as const,
      response: NextResponse.json(
        {
          error: "Corpo da requisição inválido.",
        },
        {
          status: 400,
        }
      ),
    };
  }
}
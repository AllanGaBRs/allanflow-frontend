export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { apiServer } from "../api-server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  try {
    const res = await apiServer.post("/users", {
      name,
      email,
      password,
    });

    return NextResponse.json(
      {
        success: true,
        user: res.data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Erro ao criar conta",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
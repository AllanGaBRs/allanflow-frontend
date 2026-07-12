export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { apiServer } from "@/app/api/api-server";
import { backendErrorResponse } from "@/app/api/_utils/errors";

type JwtPayload = {
  sub: string;
  userId: string;
  exp: number;
};

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const basicAuth = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");

    const res = await apiServer.post(
      "/oauth2/token",
      new URLSearchParams({
        grant_type: "password",
        username: email,
        password,
        scope: "read write",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
      }
    );

    const data = res.data;
    const decoded = jwtDecode<JwtPayload>(data.access_token);

    const response = NextResponse.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.sub,
      },
    });

    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.expires_in,
    });

    return response;
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro na autenticação",
      statusMessages: {
        400: "Email ou senha inválidos.",
        401: "Email ou senha inválidos.",
      },
    });
  }
}

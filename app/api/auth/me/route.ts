export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { apiServer } from "../../api-server";

type JwtPayload = {
  sub: string;
  userId: string;
  authorities?: string[];
  scope?: string;
};

type AuthMeResponse = {
  id?: string;
  email?: string;
  authorities?: string[];
};

export async function GET() {
  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const decoded = jwtDecode<JwtPayload>(accessToken);
    const res = await apiServer.get<AuthMeResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({
      ...res.data,
      id: decoded.userId,
      email: res.data.email || decoded.sub,
      authorities:
        res.data.authorities ||
        decoded.authorities ||
        decoded.scope?.split(" ") ||
        [],
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return NextResponse.json(
      {
        error: "Erro ao buscar usuário",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

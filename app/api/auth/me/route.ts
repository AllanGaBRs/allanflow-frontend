export const runtime = "nodejs";

import { jwtDecode } from "jwt-decode";
import { apiServer } from "@/app/api/api-server";
import {
  getAccessToken,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { jsonResponse } from "@/app/api/_utils/responses";

type JwtPayload = {
  sub: string;
  userId: string;
  authorities?: string[];
  scope?: string;
};

type AuthMeResponse = {
  id?: string;
  name?: string;
  email?: string;
  authorities?: string[];
};

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return unauthorizedResponse();
    }

    const decoded = jwtDecode<JwtPayload>(accessToken);
    const res = await apiServer.get<AuthMeResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return jsonResponse({
      ...res.data,
      id: decoded.userId,
      name: res.data.name,
      email: res.data.email || decoded.sub,
      authorities:
        res.data.authorities ||
        decoded.authorities ||
        decoded.scope?.split(" ") ||
        [],
    });
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar usuário",
    });
  }
}

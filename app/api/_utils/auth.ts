import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function getAuthorizationHeader() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return null;
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export function unauthorizedResponse(message = "Não autenticado") {
  return NextResponse.json({ error: message }, { status: 401 });
}

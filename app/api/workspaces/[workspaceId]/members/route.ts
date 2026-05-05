export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiServer } from "../../../api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  const { workspaceId } = await params;

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const res = await apiServer.get(`/workspaces/${workspaceId}/members`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return NextResponse.json(
      {
        error: "Erro ao buscar membros",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(req: Request, { params }: Params) {
  const { workspaceId } = await params;
  const body = await req.json();

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const res = await apiServer.post(
      `/workspaces/${workspaceId}/members`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(res.data, { status: 201 });
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return NextResponse.json(
      {
        error: "Erro ao adicionar membro",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
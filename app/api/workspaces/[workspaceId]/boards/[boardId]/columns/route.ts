export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiServer } from "../../../../../api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
    boardId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const res = await apiServer.get(
      `/workspaces/${workspaceId}/boards/${boardId}/columns`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return NextResponse.json(
      {
        error: "Erro ao buscar colunas",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;
  const body = await req.json();

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const res = await apiServer.post(
      `/workspaces/${workspaceId}/boards/${boardId}/columns`,
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
        error: "Erro ao criar coluna",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

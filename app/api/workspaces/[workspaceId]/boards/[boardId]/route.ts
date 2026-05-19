export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiServer } from "../../../../api-server";

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
      `/workspaces/${workspaceId}/boards/${boardId}`,
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
        error: "Erro ao buscar board",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;
  const body = await req.json();

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const res = await apiServer.put(
      `/workspaces/${workspaceId}/boards/${boardId}`,
      body,
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
        error: "Erro ao atualizar board",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, boardId } = await params;

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await apiServer.delete(`/workspaces/${workspaceId}/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return NextResponse.json(
      {
        error: "Erro ao excluir board",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

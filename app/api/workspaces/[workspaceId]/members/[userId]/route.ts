export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiServer } from "../../../../api-server";

type Params = {
  params: Promise<{
    workspaceId: string;
    userId: string;
  }>;
};

export async function PUT(req: Request, { params }: Params) {
  const { workspaceId, userId } = await params;
  const body = await req.json();

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const res = await apiServer.put(
      `/workspaces/${workspaceId}/members/${userId}`,
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
        error: "Erro ao atualizar membro",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { workspaceId, userId } = await params;

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await apiServer.delete(`/workspaces/${workspaceId}/members/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return NextResponse.json(
      {
        error: "Erro ao remover membro",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
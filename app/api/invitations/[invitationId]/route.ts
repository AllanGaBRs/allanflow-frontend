export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { jsonResponse } from "@/app/api/_utils/responses";

type Params = {
  params: Promise<{
    invitationId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  const { invitationId } = await params;

  try {
    const res = await apiServer.get(`/invitations/${invitationId}`);

    return jsonResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Não foi possível carregar o convite.",
      statusMessages: {
        404: "Convite não encontrado.",
      },
    });
  }
}

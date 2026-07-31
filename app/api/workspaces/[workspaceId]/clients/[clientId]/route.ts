export const runtime = "nodejs";

import { getAuthorizationHeader, unauthorizedResponse } from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import { jsonResponse } from "@/app/api/_utils/responses";
import { apiServer } from "@/app/api/api-server";

type Params = {
    params: Promise<{
        workspaceId: string;
        clientId: string;
    }>
}

export async function GET(req: Request, { params }: Params) {
    const { workspaceId, clientId } = await params;

    try {
        const headers = await getAuthorizationHeader();

        if (!headers) {
            return unauthorizedResponse();
        }

        const res = await apiServer.get(
            `/workspaces/${workspaceId}/clients/${clientId}`,
            {
                headers,
            }
        );

        return jsonResponse(res.data);
    } catch (error: unknown) {
        return backendErrorResponse(error, {
            fallback: "Erro ao buscar cliente",
            statusMessages: {
                403: "Você não tem permissão para acessar esse cliente.",
                404: "Cliente não encontrado.",
            }
        })
    }
}

export async function PUT(req: Request, { params }: Params) {
    const { workspaceId, clientId } = await params;
    const parsed = await parseJsonBody<Record<string, unknown>>(req);

    if (!parsed.success) {
        return parsed.response;
    }

    const body = parsed.data;

    try {
        const headers = await getAuthorizationHeader();

        if (!headers) {
            return unauthorizedResponse();
        }

        const res = await apiServer.put(
            `/workspaces/${workspaceId}/clients/${clientId}`,
            body,
            {
                headers,
            }
        );

        return jsonResponse(res.data);
    } catch (error: unknown) {
        return backendErrorResponse(error, {
            fallback: "Erro ao atualizar cliente",
            statusMessages: {
                403: "Você não tem permissão para atualizar este cliente.",
                404: "Cliente não encontrado.",
            }
        })

    }
}

export async function DELETE(req: Request, { params }: Params) {
    const { workspaceId, clientId } = await params;

    try {
        const headers = await getAuthorizationHeader();

        if (!headers) {
            return unauthorizedResponse();
        }

        await apiServer.delete(`/workspaces/${workspaceId}/clients/${clientId}`, {
            headers,
        });

        return new Response(null, { status: 204 });
    } catch (error: unknown) {
        return backendErrorResponse(error, {
            fallback: "Erro ao excluir cliente",
            statusMessages: {
                403: "Você não tem permissão para excluir um cliente.",
                404: "Cliente não encontrado.",
                409: "Não é possível excluir um cliente que está vinculado a uma ou mais tasks.",
                500: "Erro interno",
            },
        });
    }
}

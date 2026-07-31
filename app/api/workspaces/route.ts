export const runtime = "nodejs";

import { apiServer } from "@/app/api/api-server";
import {
  getAuthorizationHeader,
  unauthorizedResponse,
} from "@/app/api/_utils/auth";
import { backendErrorResponse } from "@/app/api/_utils/errors";
import { parseJsonBody } from "@/app/api/_utils/parseJsonBody";
import {
  createdResponse,
  jsonResponse,
  normalizeListResponse,
} from "@/app/api/_utils/responses";

type WorkspaceResponse = {
  id: string;
  name: string;
  userRole?: "OWNER" | "ADMIN" | "MEMBER";
};

type CreateWorkspaceDTO = {
  name: string;
};

export async function GET() {
  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.get("/workspaces/me", {
      headers,
    });

    return jsonResponse(
      normalizeListResponse<WorkspaceResponse, "workspaces">(
        res.data,
        "workspaces"
      )
    );
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao buscar workspaces",
    });
  }
}

export async function POST(req: Request) {
  const parsed = await parseJsonBody<CreateWorkspaceDTO>(req);

  if (!parsed.success) {
    return parsed.response;
  }

  const { name } = parsed.data;

  try {
    const headers = await getAuthorizationHeader();

    if (!headers) {
      return unauthorizedResponse();
    }

    const res = await apiServer.post(
      "/workspaces",
      { name },
      {
        headers,
      }
    );

    return createdResponse(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, {
      fallback: "Erro ao criar workspace",
    });
  }
}

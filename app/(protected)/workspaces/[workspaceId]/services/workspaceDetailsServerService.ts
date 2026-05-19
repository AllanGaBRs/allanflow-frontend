import axios from "axios";
import { cookies } from "next/headers";
import { apiServer } from "@/app/api/api-server";
import type { WorkspaceDetails } from "../types/workspaceDetails";

type WorkspaceDetailsServerResult = {
  workspace: WorkspaceDetails | null;
  error: string;
};

export async function getWorkspaceDetailsServerService(
  workspaceId: string
): Promise<WorkspaceDetailsServerResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return { workspace: null, error: "Não autenticado" };
    }

    const response = await apiServer.get<WorkspaceDetails>(
      `/workspaces/${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return { workspace: response.data, error: "" };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        workspace: null,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao buscar workspace",
      };
    }

    return { workspace: null, error: "Erro inesperado ao buscar workspace" };
  }
}

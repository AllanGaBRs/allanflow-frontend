import { api } from "@/app/api/api";
import type { CreateWorkspaceRequest, Workspace } from "../types/workspace";

export async function getWorkspacesService(): Promise<Workspace[]> {
  const { data } = await api.get<Workspace[]>("/workspaces");
  return data;
}

export async function createWorkspaceService(
  payload: CreateWorkspaceRequest
): Promise<Workspace> {
  const { data } = await api.post<Workspace>("/workspaces", payload);
  return data;
}

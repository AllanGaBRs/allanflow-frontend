import { api } from "@/app/api/api";
import type { Client, ClientCreatePayload } from "../types/client";

function clientUrl(workspaceId: string) {
  return `/workspaces/${workspaceId}/clients`;
}

export async function getClientsService(
  workspaceId: string
): Promise<Client[]> {
  const { data } = await api.get<Client[]>(clientUrl(workspaceId));
  return data;
}

export async function createClientService(
  workspaceId: string,
  payload: ClientCreatePayload
): Promise<Client> {
  const { data } = await api.post<Client>(clientUrl(workspaceId), payload);
  return data;
}

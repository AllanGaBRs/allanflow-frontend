import { api } from "@/app/api/api";
import type {
  Client,
  ClientCreatePayload,
  ClientUpdatePayload,
} from "../types/client";

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

export async function getClientService(
  workspaceId: string,
  clientId: string
): Promise<Client> {
  const { data } = await api.get<Client>(
    `${clientUrl(workspaceId)}/${clientId}`
  );
  return data;
}

export async function updateClientService(
  workspaceId: string,
  clientId: string,
  payload: ClientUpdatePayload
): Promise<Client> {
  const { data } = await api.put<Client>(
    `${clientUrl(workspaceId)}/${clientId}`,
    payload
  );
  return data;
}

export async function deleteClientService(
  workspaceId: string,
  clientId: string
): Promise<void> {
  await api.delete(`${clientUrl(workspaceId)}/${clientId}`);
}

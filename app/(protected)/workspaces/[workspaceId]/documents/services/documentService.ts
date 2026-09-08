import { api } from "@/app/api/api";
import type {
  DocumentCreatePayload,
  DocumentItem,
  DocumentMovePayload,
  DocumentTreeItem,
  DocumentUpdatePayload,
} from "../types/document";

function documentsUrl(workspaceId: string, boardId: string) {
  return `/workspaces/${workspaceId}/boards/${boardId}/documents`;
}

export async function getDocumentTreeService(
  workspaceId: string,
  boardId: string
): Promise<DocumentTreeItem[]> {
  const { data } = await api.get<DocumentTreeItem[]>(
    `${documentsUrl(workspaceId, boardId)}/tree`
  );

  return data;
}

export async function createDocumentService(
  workspaceId: string,
  boardId: string,
  payload: DocumentCreatePayload
): Promise<DocumentItem> {
  const { data } = await api.post<DocumentItem>(
    documentsUrl(workspaceId, boardId),
    payload
  );

  return data;
}

export async function getDocumentService(
  workspaceId: string,
  boardId: string,
  documentId: string
): Promise<DocumentItem> {
  const { data } = await api.get<DocumentItem>(
    `${documentsUrl(workspaceId, boardId)}/${documentId}`
  );

  return data;
}

export async function updateDocumentService(
  workspaceId: string,
  boardId: string,
  documentId: string,
  payload: DocumentUpdatePayload
): Promise<DocumentItem> {
  const { data } = await api.put<DocumentItem>(
    `${documentsUrl(workspaceId, boardId)}/${documentId}`,
    payload
  );

  return data;
}

export async function deleteDocumentService(
  workspaceId: string,
  boardId: string,
  documentId: string
): Promise<void> {
  await api.delete(`${documentsUrl(workspaceId, boardId)}/${documentId}`);
}

export async function moveDocumentService(
  workspaceId: string,
  boardId: string,
  documentId: string,
  payload: DocumentMovePayload
): Promise<DocumentItem> {
  const { data } = await api.patch<DocumentItem>(
    `${documentsUrl(workspaceId, boardId)}/${documentId}/move`,
    payload
  );

  return data;
}

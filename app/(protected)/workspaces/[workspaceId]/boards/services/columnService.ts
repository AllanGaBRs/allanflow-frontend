import type {
  Column,
  ColumnCreatePayload,
  ColumnUpdatePayload,
} from "../types/board";

async function parseResponseError(response: Response, fallback: string) {
  const data = await response.json().catch(() => ({}));

  if (response.status === 404) {
    return "Coluna ou board não encontrado.";
  }

  if (response.status === 401 || response.status === 403) {
    return "Você não tem permissão para executar esta ação.";
  }

  return data.error || fallback;
}

function columnUrl(workspaceId: string, boardId: string) {
  return `/api/workspaces/${workspaceId}/boards/${boardId}/columns`;
}

export async function getColumnsService(
  workspaceId: string,
  boardId: string
): Promise<Column[]> {
  const response = await fetch(columnUrl(workspaceId, boardId));

  if (!response.ok) {
    throw new Error(await parseResponseError(response, "Erro ao buscar colunas"));
  }

  return response.json();
}

export async function createColumnService(
  workspaceId: string,
  boardId: string,
  payload: ColumnCreatePayload
): Promise<Column> {
  const response = await fetch(columnUrl(workspaceId, boardId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseResponseError(response, "Erro ao criar coluna"));
  }

  return response.json();
}

export async function getColumnService(
  workspaceId: string,
  boardId: string,
  columnId: string
): Promise<Column> {
  const response = await fetch(`${columnUrl(workspaceId, boardId)}/${columnId}`);

  if (!response.ok) {
    throw new Error(await parseResponseError(response, "Erro ao buscar coluna"));
  }

  return response.json();
}

export async function updateColumnService(
  workspaceId: string,
  boardId: string,
  columnId: string,
  payload: ColumnUpdatePayload
): Promise<Column> {
  const response = await fetch(`${columnUrl(workspaceId, boardId)}/${columnId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await parseResponseError(response, "Erro ao atualizar coluna")
    );
  }

  return response.json();
}

export async function deleteColumnService(
  workspaceId: string,
  boardId: string,
  columnId: string
): Promise<void> {
  const response = await fetch(`${columnUrl(workspaceId, boardId)}/${columnId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await parseResponseError(response, "Erro ao excluir coluna"));
  }
}

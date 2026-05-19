import type { Board, BoardCreatePayload, BoardUpdatePayload } from "../types/board";

async function parseResponseError(response: Response, fallback: string) {
  const data = await response.json().catch(() => ({}));

  if (response.status === 404) {
    return "Board não encontrado.";
  }

  if (response.status === 409) {
    return "Já existe um board com este nome neste workspace.";
  }

  if (response.status === 401 || response.status === 403) {
    return "Você não tem permissão para executar esta ação.";
  }

  return data.error || fallback;
}

export async function getBoardsService(workspaceId: string): Promise<Board[]> {
  const response = await fetch(`/api/workspaces/${workspaceId}/boards`);

  if (!response.ok) {
    throw new Error(await parseResponseError(response, "Erro ao buscar boards"));
  }

  const data = await response.json();

  return Array.isArray(data) ? data : data.boards ?? [];
}

export async function createBoardService(
  workspaceId: string,
  payload: BoardCreatePayload
): Promise<Board> {
  const response = await fetch(`/api/workspaces/${workspaceId}/boards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseResponseError(response, "Erro ao criar board"));
  }

  const data = await response.json();

  return data;
}

export async function getBoardService(
  workspaceId: string,
  boardId: string
): Promise<Board> {
  const response = await fetch(
    `/api/workspaces/${workspaceId}/boards/${boardId}`
  );

  if (!response.ok) {
    throw new Error(await parseResponseError(response, "Erro ao buscar board"));
  }

  const data = await response.json();

  return data;
}

export async function updateBoardService(
  workspaceId: string,
  boardId: string,
  payload: BoardUpdatePayload
): Promise<Board> {
  const response = await fetch(
    `/api/workspaces/${workspaceId}/boards/${boardId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseResponseError(response, "Erro ao atualizar board")
    );
  }

  const data = await response.json();

  return data;
}

export async function deleteBoardService(
  workspaceId: string,
  boardId: string
): Promise<void> {
  const response = await fetch(
    `/api/workspaces/${workspaceId}/boards/${boardId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(await parseResponseError(response, "Erro ao excluir board"));
  }
}

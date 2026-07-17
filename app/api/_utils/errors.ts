import axios from "axios";
import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/app/api/_utils/auth";

type BackendErrorBody = {
  error?: string;
  message?: string;
};

type BackendErrorResponseOptions = {
  fallback: string;
  statusMessages?: Partial<Record<number, string>>;
};

function getBackendErrorStatus(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? 500;
  }

  return 500;
}

function isBackendUnavailable(error: unknown) {
  return axios.isAxiosError(error) && !error.response;
}

function getBackendErrorBody(error: unknown) {
  if (!axios.isAxiosError<BackendErrorBody>(error)) {
    return null;
  }

  return error.response?.data ?? null;
}

export function getBackendErrorMessage(
  error: unknown,
  { fallback, statusMessages }: BackendErrorResponseOptions
) {
  const status = getBackendErrorStatus(error);
  const body = getBackendErrorBody(error);

  return (
    statusMessages?.[status] ||
    body?.error ||
    body?.message ||
    fallback
  );
}

export function logBackendError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data || error.message);
    return;
  }

  if (error instanceof Error) {
    console.error(error.message);
    return;
  }

  console.error("Erro inesperado no BFF");
}

export function backendErrorResponse(
  error: unknown,
  options: BackendErrorResponseOptions
) {
  logBackendError(error);

  const status = isBackendUnavailable(error) ? 401 : getBackendErrorStatus(error);
  const response = NextResponse.json(
    {
      error: isBackendUnavailable(error)
        ? "Sessão encerrada. Faça login novamente."
        : getBackendErrorMessage(error, options),
    },
    {
      status,
    }
  );

  if (status === 401) {
    return clearAuthCookie(response);
  }

  return response;
}

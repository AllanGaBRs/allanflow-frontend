import axios from "axios";
import { NextResponse } from "next/server";

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

  return NextResponse.json(
    {
      error: getBackendErrorMessage(error, options),
    },
    {
      status: getBackendErrorStatus(error),
    }
  );
}

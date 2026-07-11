import { NextResponse } from "next/server";

type ListResponse<K extends string, T> = Partial<Record<K, T[]>>;

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function createdResponse<T>(data: T) {
  return jsonResponse(data, 201);
}

export function normalizeListResponse<T, K extends string>(
  data: T[] | ListResponse<K, T>,
  key: K
) {
  if (Array.isArray(data)) {
    return data;
  }

  return data[key] ?? [];
}

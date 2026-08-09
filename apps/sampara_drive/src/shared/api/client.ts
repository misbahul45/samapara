import { env } from '@/config/env';

export interface ApiErrorBody {
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${env.apiBase}${path}`, {
    headers: { accept: 'application/json' },
  });
  if (!res.ok) {
    throw await toApiError(res);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${env.apiBase}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw await toApiError(res);
  }
  return res.json() as Promise<T>;
}

export function apiErrorMessage(err: unknown): string {
  if (err instanceof ApiError && err.message) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'request failed';
}

async function toApiError(res: Response): Promise<ApiError> {
  let message = `request failed (${res.status})`;
  try {
    const data = (await res.json()) as ApiErrorBody;
    if (data.error) {
      message = data.error;
    }
  } catch {
    return new ApiError(message, res.status);
  }
  return new ApiError(message, res.status);
}

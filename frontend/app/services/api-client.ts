import { useAuthStore } from "../stores/auth-store";

export type ApiErrorBody = {
  detail?: string;
  title?: string;
  message?: string;
  error?: string;
  status?: number;
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly body?: unknown;

  constructor(
    message: string,
    status: number,
    body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type ApiRequestInit = RequestInit & { token?: string | null; unauthenticated?: boolean; errorMessage?: string };

function messageFromBody(body: unknown, fallback: string) {
  if (body && typeof body === "object") {
    const data = body as ApiErrorBody;
    return data.detail ?? data.message ?? data.error ?? data.title ?? fallback;
  }
  return fallback;
}

export async function responseError(response: Response, fallback: string) {
  let body: unknown;
  try { body = await response.json(); } catch { body = undefined; }
  return messageFromBody(body, fallback);
}

export async function apiFetch(input: RequestInfo | URL, init: ApiRequestInit = {}): Promise<Response> {
  const { token, unauthenticated = false, errorMessage = "La solicitud a la API ha fallado.", ...requestInit } = init;
  const headers = new Headers(requestInit.headers);
  const accessToken = token === undefined ? useAuthStore.getState().accessToken : token;
  if (!unauthenticated && accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response: Response;
  try {
    response = await fetch(input, { ...requestInit, headers });
  } catch (cause) {
    if (cause instanceof Error && cause.name === "AbortError") throw cause;
    throw new ApiError(cause instanceof Error ? cause.message : "No se pudo conectar con el servidor.", 0, cause);
  }

  if (!response.ok) {
    let body: unknown;
    try { body = await response.clone().json(); } catch { body = undefined; }
    throw new ApiError(messageFromBody(body, errorMessage), response.status, body);
  }
  return response;
}

export async function apiJson<T>(input: RequestInfo | URL, init?: ApiRequestInit): Promise<T> {
  const response = await apiFetch(input, init);
  return response.json() as Promise<T>;
}

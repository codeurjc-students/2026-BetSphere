import { useAuthStore } from "../stores/auth-store";
import { AuthTokenError, refreshAccessToken } from "./auth-token";

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

async function send(input: RequestInfo | URL, init: RequestInit, headers: Headers) {
  try {
    return await fetch(input, { ...init, headers });
  } catch (cause) {
    if (cause instanceof Error && cause.name === "AbortError") throw cause;
    throw new ApiError(
      cause instanceof Error ? cause.message : "Could not connect to the server.",
      0,
      cause,
    );
  }
}

async function throwForResponse(response: Response, fallback: string): Promise<never> {
  let body: unknown;
  try { body = await response.clone().json(); } catch { body = undefined; }
  throw new ApiError(messageFromBody(body, fallback), response.status, body);
}

/**
 * Fetches the API and throws ApiError for HTTP failures. A 401 with a bearer
 * token gets one refresh attempt and one retry before the error is surfaced.
 */
export async function apiFetch(input: RequestInfo | URL, init: ApiRequestInit = {}): Promise<Response> {
  const { token, unauthenticated = false, errorMessage = "The API request failed.", ...requestInit } = init;
  const headers = new Headers(requestInit.headers);
  const accessToken = token === undefined ? useAuthStore.getState().accessToken : token;
  if (!unauthenticated && accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const retryInput = input instanceof Request ? input.clone() : input;
  let response = await send(input, requestInit, headers);
  const sentBearerToken = headers.get("Authorization")?.startsWith("Bearer ") ?? false;

  if (response.status === 401 && !unauthenticated && sentBearerToken) {
    let renewedToken: string | undefined;
    try {
      renewedToken = await refreshAccessToken();
      useAuthStore.getState().setAccessToken(renewedToken);
    } catch (error) {
      if (error instanceof AuthTokenError && [400, 401].includes(error.status)) {
        useAuthStore.getState().clearSession();
      }
    }

    if (renewedToken) {
      const retryHeaders = new Headers(headers);
      retryHeaders.set("Authorization", `Bearer ${renewedToken}`);
      response = await send(retryInput, requestInit, retryHeaders);
    }
  }

  if (!response.ok) await throwForResponse(response, errorMessage);
  return response;
}

/** Converts an API failure into a route response while preserving its HTTP status. */
export function throwRouteResponse(error: unknown, fallback: string): never {
  if (error instanceof ApiError) {
    const status = error.status >= 400 && error.status <= 599 ? error.status : 500;
    throw new Response(error.message || fallback, { status });
  }
  throw error;
}

export async function apiJson<T>(input: RequestInfo | URL, init?: ApiRequestInit): Promise<T> {
  const response = await apiFetch(input, init);
  return response.json() as Promise<T>;
}

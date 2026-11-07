import type { AuthResponseDTO } from "../dtos/AuthResponseDTO";

const REFRESH_URL = "/api/v1/auth/refresh";
const REFRESH_TIMEOUT_MS = 8_000;

export class AuthTokenError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "AuthTokenError";
  }
}

let refreshInProgress: Promise<string> | undefined;

async function requestNewAccessToken(): Promise<string> {
  let response: Response;
  try {
    // Bypass apiFetch here: a failed refresh must not recursively trigger another refresh.
    response = await fetch(REFRESH_URL, {
      method: "POST",
      credentials: "include",
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    });
  } catch (cause) {
    if (cause instanceof Error && cause.name === "AbortError") throw cause;
    throw new AuthTokenError(
      cause instanceof Error ? cause.message : "No se pudo renovar la sesión.",
      0,
    );
  }

  let result: AuthResponseDTO | undefined;
  try {
    result = (await response.json()) as AuthResponseDTO;
  } catch {
    result = undefined;
  }

  if (!response.ok || result?.status !== "SUCCESS" || !result.accessToken) {
    throw new AuthTokenError(
      result?.message || "La sesión ha expirado.",
      response.status,
    );
  }

  return result.accessToken;
}

/** Shares a single refresh request between startup restoration and 401 retries. */
export function refreshAccessToken(): Promise<string> {
  if (!refreshInProgress) {
    refreshInProgress = requestNewAccessToken().finally(() => {
      refreshInProgress = undefined;
    });
  }
  return refreshInProgress;
}

import type { LoginRequestDTO } from "../dtos/LoginRequestDTO";
import type { AuthResponseDTO } from "../dtos/AuthResponseDTO";
import type { RegisterRequestDTO } from "../dtos/RegisterRequestDTO";
import type { UserDTO } from "../dtos/UserDTO";

const AUTH_URL = "/api/v1/auth";
const USERS_URL = "/api/v1/users";
const SESSION_REQUEST_TIMEOUT_MS = 8_000;

export class AuthServiceError extends Error {
  public readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "AuthServiceError";
    this.status = status;
  }
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object") {
      const data = body as { message?: unknown; error?: unknown };
      if (typeof data.message === "string") return data.message;
      if (typeof data.error === "string") return data.error;
    }
  } catch {
    // Some API errors have no JSON body, so use the caller's fallback.
  }
  return fallback;
}

export async function login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new AuthServiceError(
      await readErrorMessage(response, "Could not log in"),
      response.status,
    );
  }

  const result = (await response.json()) as AuthResponseDTO;
  if (result.status !== "SUCCESS" || !result.accessToken) {
    throw new AuthServiceError(result.message || "Could not log in", response.status);
  }

  return result;
}

export async function register(
  details: RegisterRequestDTO,
): Promise<UserDTO> {
  const response = await fetch(`${USERS_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    throw new AuthServiceError(
      await readErrorMessage(response, "Could not create the account"),
      response.status,
    );
  }

  return (await response.json()) as UserDTO;
}

export async function getCurrentUser(accessToken: string): Promise<UserDTO> {
  const response = await fetch(`${USERS_URL}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(SESSION_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new AuthServiceError(
      await readErrorMessage(response, "Could not load the user."),
      response.status,
    );
  }

  return (await response.json()) as UserDTO;
}

export async function logout() {
  await fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${AUTH_URL}/refresh`, {
    method: "POST",
    credentials: "include",
    signal: AbortSignal.timeout(SESSION_REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new AuthServiceError(
      await readErrorMessage(response, "Sesion expired."),
      response.status,
    );
  }
  const result = (await response.json()) as AuthResponseDTO;
  if (result.status !== "SUCCESS" || !result.accessToken) {
    throw new AuthServiceError(result.message || "Sesion expired.", response.status);
  }
  return result.accessToken;
}

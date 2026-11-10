import type { LoginRequestDTO } from "../dtos/LoginRequestDTO";
import type { AuthResponseDTO } from "../dtos/AuthResponseDTO";
import type { RegisterRequestDTO } from "../dtos/RegisterRequestDTO";
import type { UserDTO } from "../dtos/UserDTO";
import { apiFetch, ApiError } from "./api-client";
import { refreshAccessToken as requestNewAccessToken } from "./auth-token";

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

async function authRequest(input: RequestInfo | URL, init: RequestInit & { errorMessage: string }) {
  try {
    return await apiFetch(input, { ...init, unauthenticated: true });
  } catch (error) {
    if (error instanceof ApiError) throw new AuthServiceError(error.message, error.status);
    throw error;
  }
}

export async function login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
  const response = await authRequest(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
    errorMessage: "Could not log in",
  });

  const result = (await response.json()) as AuthResponseDTO;
  if (result.status !== "SUCCESS" || !result.accessToken) {
    throw new AuthServiceError(result.message || "Could not log in", response.status);
  }

  return result;
}

export async function register(
  details: RegisterRequestDTO,
): Promise<UserDTO> {
  const response = await authRequest(`${USERS_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(details),
    errorMessage: "Could not create the account",
  });

  return (await response.json()) as UserDTO;
}

export async function getCurrentUser(accessToken: string): Promise<UserDTO> {
  const response = await authRequest(`${USERS_URL}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(SESSION_REQUEST_TIMEOUT_MS),
    errorMessage: "Could not load the user.",
  });

  return (await response.json()) as UserDTO;
}

export async function logout() {
  await authRequest(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",
    errorMessage: "Could not log out.",
  });
}

export async function refreshAccessToken(): Promise<string> {
  return requestNewAccessToken();
}

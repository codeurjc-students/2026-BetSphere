import { useAuthStore } from "../stores/auth-store";

/** Sends admin mutations with the current JWT; backend role checks remain authoritative. */
export function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("Session expired.");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

export async function adminResponseError(response: Response, fallback: string) {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object") {
      const data = body as { error?: unknown; message?: unknown };
      if (typeof data.error === "string") return data.error;
      if (typeof data.message === "string") return data.message;
    }
  } catch {
    // Some endpoints return an empty response for errors.
  }
  return fallback;
}

import { afterEach, expect, it, vi } from "vitest";
import { apiJson } from "../../app/services/api-client";
import { useAuthStore } from "../../app/stores/auth-store";

const originalState = useAuthStore.getState();
const profileUrl = "/api/v1/users/me";
const refreshUrl = "/api/v1/auth/refresh";

afterEach(() => {
  vi.unstubAllGlobals();
  useAuthStore.setState(originalState);
});

it("retries the profile request with the renewed token after a 401", async () => {
  const profile = { username: "fan" };
  const fetchMock = vi.fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(null, { status: 401 }))
    .mockResolvedValueOnce(Response.json({ status: "SUCCESS", accessToken: "renewed-token" }))
    .mockResolvedValueOnce(Response.json(profile));
  vi.stubGlobal("fetch", fetchMock);
  useAuthStore.getState().setAccessToken("expired-token");

  await expect(apiJson(profileUrl)).resolves.toEqual(profile);

  expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([profileUrl, refreshUrl, profileUrl]);
  expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get("Authorization")).toBe("Bearer expired-token");
  expect(new Headers(fetchMock.mock.calls[2][1]?.headers).get("Authorization")).toBe("Bearer renewed-token");
  expect(useAuthStore.getState().accessToken).toBe("renewed-token");
});

it("clears the session and does not retry if the refresh cookie is rejected", async () => {
  const fetchMock = vi.fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ error: "Sign in again" }, { status: 401 }))
    .mockResolvedValueOnce(Response.json({ status: "FAILURE" }, { status: 401 }));
  vi.stubGlobal("fetch", fetchMock);
  useAuthStore.getState().setSession("expired-token", {
    id: 1, username: "fan", email: "fan@example.test",
    roles: ["ROLE_REGISTERED"], birthDate: "1990-01-01", virtualBalance: 0,
  });

  await expect(apiJson(profileUrl)).rejects.toMatchObject({ status: 401, message: "Sign in again" });

  expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([profileUrl, refreshUrl]);
  expect(useAuthStore.getState()).toMatchObject({ accessToken: null, user: null });
});

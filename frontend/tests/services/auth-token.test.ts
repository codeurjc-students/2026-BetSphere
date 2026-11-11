import { afterEach, expect, it, vi } from "vitest";
import { refreshAccessToken } from "../../app/services/auth-token";

afterEach(() => vi.unstubAllGlobals());

it("shares concurrent refreshes and sends the session cookie", async () => {
  const fetchMock = vi.fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ status: "SUCCESS", accessToken: "renewed-token" }))
    .mockResolvedValueOnce(Response.json({ status: "SUCCESS", accessToken: "next-token" }));
  vi.stubGlobal("fetch", fetchMock);

  await expect(Promise.all([refreshAccessToken(), refreshAccessToken()]))
    .resolves.toEqual(["renewed-token", "renewed-token"]);

  expect(fetchMock).toHaveBeenCalledOnce();
  expect(fetchMock).toHaveBeenCalledWith(
    "/api/v1/auth/refresh", expect.objectContaining({ method: "POST", credentials: "include" }),
  );
  await expect(refreshAccessToken()).resolves.toBe("next-token");
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

it("rejects a refresh response that is not JSON", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>Unavailable</html>", { status: 502 })));

  await expect(refreshAccessToken()).rejects.toMatchObject({
    name: "AuthTokenError", status: 502, message: "Session has expired.",
  });
});

it("preserves the network error message when the refresh request fails", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Network unavailable")));

  await expect(refreshAccessToken()).rejects.toMatchObject({
    name: "AuthTokenError", status: 0, message: "Network unavailable",
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUser, refreshAccessToken } from "../../../app/services/auth-service";
import { restoreSession, useAuthStore } from "../../../app/stores/auth-store";

vi.mock("../../../app/services/auth-service", () => ({
  getCurrentUser: vi.fn(),
  refreshAccessToken: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
  useAuthStore.setState({ accessToken: null, user: null, initialized: false });
});

describe("restoreSession", () => {
  it("loads the user after renewing the access token", async () => {
    const user = {
      id: 1,
      username: "user",
      email: "user@example.test",
      roles: ["ROLE_REGISTERED"],
      birthDate: "1990-06-15",
      virtualBalance: 0,
    };
    vi.mocked(refreshAccessToken).mockResolvedValue("renewed-token");
    vi.mocked(getCurrentUser).mockResolvedValue(user);

    await restoreSession();

    expect(getCurrentUser).toHaveBeenCalledWith("renewed-token");
    expect(useAuthStore.getState()).toMatchObject({
      accessToken: "renewed-token", user, initialized: true,
    });
  });

  it("finishes initialization signed out when renewal fails", async () => {
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error("Session expired"));

    await restoreSession();

    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(useAuthStore.getState()).toMatchObject({
      accessToken: null, user: null, initialized: true,
    });
  });
});

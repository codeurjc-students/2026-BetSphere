import { afterEach, expect, it, vi } from "vitest";
import { requireAdmin } from "../../app/services/auth-guards";
import { getUsersPage } from "../../app/services/user-service";
import { useAuthStore } from "../../app/stores/auth-store";

const initialState = useAuthStore.getState();
const request = new Request("http://localhost/admin");

afterEach(() => {
  useAuthStore.setState(initialState);
  vi.unstubAllGlobals();
});

it.each([
  [["ROLE_ADMIN"], true],
  [["ROLE_REGISTERED"], false],
] as const)("checks admin access for roles %j", async (roles, allowed) => {
  useAuthStore.getState().setSession("test-token", {
    id: 1, username: "tester", email: "test@example.test",
    roles: [...roles], birthDate: "1990-01-01", virtualBalance: 0,
  });

  const result = requireAdmin({ request });
  if (allowed) {
    await expect(result).resolves.toBeUndefined();
  } else {
    await expect(result).rejects.toMatchObject({ status: 302 });
  }
});

it("requests the selected page of users", async () => {
  const page = { content: [], number: 1, size: 5, totalElements: 5, totalPages: 1, last: true };
  const fetchMock = vi.fn().mockResolvedValue(Response.json(page));
  vi.stubGlobal("fetch", fetchMock);

  await expect(getUsersPage(1, 5)).resolves.toEqual(page);
  expect(fetchMock).toHaveBeenCalledWith("/api/v1/users/?page=1&size=5", expect.anything());
});

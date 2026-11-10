import { beforeEach, expect, it, vi } from "vitest";
import { performAdminAction } from "../../app/services/admin-actions";
import { createTeam } from "../../app/services/competition-service";
import { deleteTeam, getTeam, updateTeam } from "../../app/services/team-service";

vi.mock("../../app/services/competition-service", () => ({ createTeam: vi.fn() }));
vi.mock("../../app/services/team-service", () => ({
  getTeam: vi.fn(), updateTeam: vi.fn(), deleteTeam: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

it.each(["create", "edit", "delete"] as const)("handles the team %s form", async (intent) => {
  const body = new FormData();
  Object.entries({ entity: "teams", intent, id: "12", name: "QA Team", country: "Spain", competitionId: "3" })
    .forEach(([key, value]) => body.set(key, value));
  const result = await performAdminAction(new Request("http://localhost/admin", { method: "POST", body }));

  expect(result).toEqual({ ok: true, entity: "teams", intent });
  const payload = { name: "QA Team", country: "Spain", logoUrl: null };
  if (intent === "create") expect(createTeam).toHaveBeenCalledWith(3, payload);
  if (intent === "edit") {
    expect(getTeam).toHaveBeenCalledWith(12);
    expect(updateTeam).toHaveBeenCalledWith(12, payload);
  }
  if (intent === "delete") expect(deleteTeam).toHaveBeenCalledWith(12);
});

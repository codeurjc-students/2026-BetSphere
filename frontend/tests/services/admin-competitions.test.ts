import { beforeEach, expect, it, vi } from "vitest";
import { performAdminAction } from "../../app/services/admin-actions";
import { addCompetition, deleteCompetition, updateCompetition } from "../../app/services/competition-service";

vi.mock("../../app/services/competition-service", () => ({
  addCompetition: vi.fn(),
  updateCompetition: vi.fn(),
  deleteCompetition: vi.fn(),
  createTeam: vi.fn(),
  uploadCompetitionImage: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

it.each(["create", "edit", "delete"] as const)("handles the competition %s form", async (intent) => {
  const body = new FormData();
  body.set("entity", "competitions");
  body.set("intent", intent);
  body.set("id", "12");
  body.set("name", "La Liga");
  body.set("country", "Spain");
  body.set("sportId", "3");

  const result = await performAdminAction(new Request("http://localhost/admin", { method: "POST", body }));

  const payload = { name: "La Liga", country: "Spain", sportId: 3 };
  expect(result).toEqual({ ok: true, entity: "competitions", intent });
  if (intent === "create") expect(addCompetition).toHaveBeenCalledWith(payload);
  if (intent === "edit") expect(updateCompetition).toHaveBeenCalledWith(12, payload);
  if (intent === "delete") expect(deleteCompetition).toHaveBeenCalledWith(12);
});

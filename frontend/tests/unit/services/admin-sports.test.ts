import { beforeEach, expect, it, vi } from "vitest";
import { performAdminAction } from "../../../app/services/admin-actions";
import { addSport, deleteSport, updateSport } from "../../../app/services/sport-service";

vi.mock("../../../app/services/sport-service", () => ({
  addSport: vi.fn(),
  updateSport: vi.fn(),
  deleteSport: vi.fn(),
  uploadSportImage: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

it.each(["create", "edit", "delete"] as const)("routes the sport %s form to the corresponding service", async (intent) => {
  const body = new FormData();
  body.set("entity", "sports");
  body.set("intent", intent);
  body.set("id", "12");
  body.set("name", "Hockey");

  const result = await performAdminAction(new Request("http://localhost/admin", { method: "POST", body }));

  expect(result).toEqual({ ok: true, entity: "sports", intent });
  if (intent === "create") expect(addSport).toHaveBeenCalledWith({ name: "Hockey" });
  if (intent === "edit") expect(updateSport).toHaveBeenCalledWith(12, { name: "Hockey" });
  if (intent === "delete") expect(deleteSport).toHaveBeenCalledWith(12);
});

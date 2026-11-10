import { beforeEach, expect, it, vi } from "vitest";
import { performAdminAction } from "../../app/services/admin-actions";
import { addMatch, deleteMatch, updateMatch } from "../../app/services/match-service";
import { getTeam } from "../../app/services/team-service";
import type { TeamDTO } from "../../app/dtos/TeamDTO";

vi.mock("../../app/services/match-service", () => ({
  addMatch: vi.fn(), updateMatch: vi.fn(), deleteMatch: vi.fn(),
}));
vi.mock("../../app/services/team-service", () => ({ getTeam: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getTeam).mockImplementation(async (id) => ({
    id, name: id === 1 ? "Home" : "Away", country: "Spain", logoUrl: null,
    wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, totalMatches: 0,
  } satisfies TeamDTO));
});

it.each(["create", "edit", "delete"] as const)("handles the match %s form", async (intent) => {
  const body = new FormData();
  const matchDate = "2030-06-01T18:00";
  Object.entries({
    entity: "matches", intent, id: "12", homeTeamId: "1", awayTeamId: "2",
    competitionId: "3", matchDate, homeOdds: "2.5", gameStatus: "SCHEDULED",
  }).forEach(([key, value]) => body.set(key, value));
  const result = await performAdminAction(new Request("http://localhost/admin", { method: "POST", body }));

  expect(result).toEqual({ ok: true, entity: "matches", intent });
  const payload = {
    homeTeamId: 1, awayTeamId: 2, competitionId: 3, homeTeam: "Home", awayTeam: "Away",
    matchDate, homeOdds: 2.5, drawOdds: null, awayOdds: null, gameStatus: "SCHEDULED",
  };
  if (intent === "create") expect(addMatch).toHaveBeenCalledWith(payload);
  if (intent === "edit") expect(updateMatch).toHaveBeenCalledWith(12, payload);
  if (intent === "delete") expect(deleteMatch).toHaveBeenCalledWith(12);
});

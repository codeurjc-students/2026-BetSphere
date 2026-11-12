import { afterEach, expect, it, vi } from "vitest";
import { clientLoader as loadCompetition } from "../../../app/routes/competitions";
import { clientLoader as loadMatch } from "../../../app/routes/match";
import { clientLoader as loadMatches } from "../../../app/routes/matches";
import { clientLoader as loadSportsIndex } from "../../../app/routes/sports-index";
import { clientLoader as loadSport } from "../../../app/routes/sports";
import { clientLoader as loadTeam } from "../../../app/routes/team";
import { optionalUser } from "../../../app/services/auth-guards";

vi.mock("../../../app/services/auth-guards", () => ({ optionalUser: vi.fn() }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

const sport = (id: string) => loadSport({ params: { id } } as Parameters<typeof loadSport>[0]);
const competition = (id: string) => loadCompetition({ params: { id } } as Parameters<typeof loadCompetition>[0]);
const match = (id: string) => loadMatch({ params: { id } } as Parameters<typeof loadMatch>[0]);
const team = (id: string) => loadTeam({ params: { id } } as Parameters<typeof loadTeam>[0]);

it.each([
  { resource: "sport", load: sport },
  { resource: "competition", load: competition },
  { resource: "match", load: match },
  { resource: "team", load: team },
])("rejects an invalid $resource ID before requesting data", async ({ load }) => {
  const fetchMock = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", fetchMock);

  await expect(load("not-an-id")).rejects.toMatchObject({ status: 400 });
  expect(fetchMock).not.toHaveBeenCalled();
  expect(optionalUser).not.toHaveBeenCalled();
});

it("loads the sport catalog for the home page", async () => {
  const sports = [{ id: 1, name: "Football" }];
  vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(Response.json({ content: sports })));

  await expect(loadSportsIndex()).resolves.toEqual(sports);
});

it.each([
  { resource: "sports", load: sport },
  { resource: "competitions", load: competition },
])("loads the $resource detail for the URL parameter", async ({ resource, load }) => {
  const item = { id: 12, name: "Catalog entry" };
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json(item));
  vi.stubGlobal("fetch", fetchMock);

  await expect(load("12")).resolves.toEqual(item);
  expect(fetchMock.mock.calls.map(([input]) => input)).toEqual([`/api/v1/${resource}/12`]);
});

it("loads match details for an anonymous visitor", async () => {
  const fixture = { id: 12, homeOdds: 2.1 };
  vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(Response.json(fixture)));
  vi.mocked(optionalUser).mockResolvedValue(null);

  await expect(match("12")).resolves.toEqual({ match: fixture, user: null });
});

it("selects the competition that contains the requested team", async () => {
  const selectedTeam = { id: 12, name: "Barcelona" };
  const selectedCompetition = { id: 2, name: "La Liga", teams: [selectedTeam] };
  const fetchMock = vi.fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json(selectedTeam))
    .mockResolvedValueOnce(Response.json({ content: [{ id: 1, teams: [{ id: 13 }] }, selectedCompetition] }));
  vi.stubGlobal("fetch", fetchMock);

  await expect(team("12")).resolves.toEqual({ team: selectedTeam, competition: selectedCompetition });
});

it.each([
  { query: "?page=2", expectedPage: 2 },
  { query: "?page=-3", expectedPage: 0 },
])("requests page $expectedPage for the matches URL with $query", async ({ query, expectedPage }) => {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ content: [], number: expectedPage }));
  vi.stubGlobal("fetch", fetchMock);
  const request = new Request(`http://localhost/matches${query}`);

  await expect(loadMatches({ request } as Parameters<typeof loadMatches>[0])).resolves.toMatchObject({ number: expectedPage });
  expect(fetchMock.mock.calls.map(([input]) => input)).toEqual([`/api/v1/matches/?page=${expectedPage}&size=10`]);
});

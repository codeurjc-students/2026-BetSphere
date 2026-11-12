import { afterEach, expect, it, vi } from "vitest";
import { getById as getCompetition, getCompetitions } from "../../../app/services/competition-service";
import { getMatchById, getMatchesPage } from "../../../app/services/match-service";
import { getById as getSport, getSports } from "../../../app/services/sport-service";
import { getTeam } from "../../../app/services/team-service";

afterEach(() => vi.unstubAllGlobals());

it.each([
  { resource: "sports", read: getSports, item: { id: 1, name: "Football" } },
  { resource: "competitions", read: getCompetitions, item: { id: 2, name: "La Liga" } },
])("reads the $resource list from an array or a page", async ({ resource, read, item }) => {
  const fetchMock = vi.fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json([item]))
    .mockResolvedValueOnce(Response.json({ content: [item] }));
  vi.stubGlobal("fetch", fetchMock);

  await expect(read()).resolves.toEqual([item]);
  await expect(read()).resolves.toEqual([item]);
  const url = `/api/v1/${resource}/?page=0&size=10000`;
  expect(fetchMock.mock.calls.map(([input]) => input)).toEqual([url, url]);
});

it("requests the selected match page and preserves its pagination metadata", async () => {
  const page = {
    content: [{ id: 11, homeTeam: "Real Madrid", awayTeam: "Barcelona" }],
    number: 2, size: 5, totalPages: 3, totalElements: 11, last: true,
  };
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json(page));
  vi.stubGlobal("fetch", fetchMock);

  await expect(getMatchesPage(2, 5)).resolves.toEqual(page);
  expect(fetchMock.mock.calls.map(([input]) => input)).toEqual(["/api/v1/matches/?page=2&size=5"]);
});

const detailReaders = [
  { resource: "sports", read: getSport, item: { id: 7, name: "Football" } },
  { resource: "competitions", read: getCompetition, item: { id: 7, name: "La Liga" } },
  { resource: "matches", read: getMatchById, item: { id: 7, homeOdds: 2.1 } },
  { resource: "teams", read: getTeam, item: { id: 7, name: "Barcelona" } },
];

it.each(detailReaders)("reads the requested $resource detail", async ({ resource, read, item }) => {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json(item));
  vi.stubGlobal("fetch", fetchMock);

  await expect(read(item.id)).resolves.toEqual(item);
  expect(fetchMock.mock.calls.map(([input]) => input)).toEqual([`/api/v1/${resource}/${item.id}`]);
});

it.each(detailReaders)("preserves the 404 and error message for missing $resource", async ({ read }) => {
  vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(
    Response.json({ detail: "Record not found" }, { status: 404 }),
  ));

  const response = await read(99).catch((error: unknown) => error);
  expect(response).toBeInstanceOf(Response);
  expect(response).toMatchObject({ status: 404 });
  await expect((response as Response).text()).resolves.toBe("Record not found");
});

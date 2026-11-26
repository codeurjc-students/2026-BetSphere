import { fireEvent, render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
  useLoaderData,
} from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import MatchList, { clientLoader } from "../../../app/routes/matches";
import { HydrateFallback, ErrorBoundary } from "../../../app/root";

// Mock data 
const mockMatches = [
  {
    id: 1,
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    matchDate: "2026-10-01",
    gameStatus: "SCHEDULED",
  },
];

const activeRouters: ReturnType<typeof createMemoryRouter>[] = [];

// Wrapper to extract loaderData from the router context and pass it as a prop, matching MatchList component signature.
function MatchesTestRoute() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;
  return <MatchList loaderData={loaderData} />;
}

function renderMatchesRoute() {
  const routes: RouteObject[] = [
    {
      path: "/",
      loader: clientLoader,
      Component: MatchesTestRoute,
      HydrateFallback,
      ErrorBoundary
    },
  ];
  const router = createMemoryRouter(routes, { initialEntries: ["/"] });
  activeRouters.push(router);

  render(<RouterProvider router={router} />);
}

afterEach(() => {
  // Clean up routers and fetch stubs after each test to prevent memory leaks
  activeRouters.splice(0).forEach((router) => router.dispose());
  vi.unstubAllGlobals();
});

describe("Matches route", () => {
  it("renders the matches returned through the mocked HTTP fetch", async () => {
    // 1. Stub the global fetch to return our mock matches
    const fetchSpy = vi.fn().mockResolvedValue(Response.json({ content: mockMatches, number: 0, size: 10, totalElements: 1, totalPages: 1, last: true }));
    vi.stubGlobal("fetch", fetchSpy);

    // 2. Render the full routing context
    renderMatchesRoute();

    // 3. Await the heading to ensure the loader has finished executing
    expect(
      await screen.findByRole("heading", { name: "Matches" })
    ).toBeInTheDocument();

    // 4. Assert the main entity data is rendered
    expect(screen.getByRole("link", { name: /Real Madrid.*vs.*Barcelona/ })).toHaveAttribute(
      "href",
      "/match/1",
    );
    expect(screen.getByText(/SCHEDULED/)).toBeInTheDocument();
  });

  it("renders an empty list when the API returns no matches", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ content: [], number: 0, size: 10, totalElements: 0, totalPages: 0, last: true })));

    renderMatchesRoute();

    expect(
      await screen.findByRole("heading", { name: "Matches" })
    ).toBeInTheDocument();

    expect(screen.getByText("No matches available.")).toBeInTheDocument();
  });

  it("searches through the API and keeps the filters on the next page", async () => {
    const firstResult = { ...mockMatches[0], id: 2, homeTeam: "Liverpool", awayTeam: "Chelsea" };
    const nextResult = { ...firstResult, id: 3, homeTeam: "Arsenal" };
    const fetchSpy = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ content: mockMatches, number: 0, last: true }))
      .mockResolvedValueOnce(Response.json({ content: [firstResult], number: 0, last: false }))
      .mockResolvedValueOnce(Response.json({ content: [nextResult], number: 1, last: true }));
    vi.stubGlobal("fetch", fetchSpy);

    renderMatchesRoute();
    const search = await screen.findByRole("searchbox", { name: "Find a team" });
    fireEvent.change(search, { target: { value: "Chelsea" } });
    expect(await screen.findByRole("link", { name: "Liverpool vs Chelsea" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Real Madrid vs Barcelona" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(await screen.findByRole("link", { name: "Arsenal vs Chelsea" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Liverpool vs Chelsea" })).toBeInTheDocument();
    expect(fetchSpy.mock.calls.map(([url]) => url)).toEqual([
      "/api/v1/matches/?page=0&size=10",
      "/api/v1/matches/?page=0&size=10&q=Chelsea",
      "/api/v1/matches/?page=1&size=10&q=Chelsea",
    ]);
  });
});

import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
  useLoaderData,
} from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import MatchList, { clientLoader } from "../../app/routes/matches";
import { HydrateFallback, ErrorBoundary } from "../../app/root";

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
    const fetchSpy = vi.fn().mockResolvedValue(Response.json(mockMatches));
    vi.stubGlobal("fetch", fetchSpy);

    // 2. Render the full routing context
    renderMatchesRoute();

    // 3. Await the heading to ensure the loader has finished executing
    expect(
      await screen.findByRole("heading", { name: "Available Matches:" })
    ).toBeInTheDocument();

    // 4. Assert the main entity data is rendered
    expect(screen.getByText("Real Madrid vs Barcelona")).toBeInTheDocument();
    expect(screen.getByText(/SCHEDULED/)).toBeInTheDocument();
  });

  it("renders an empty list when the API returns no matches", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json([])));

    renderMatchesRoute();

    expect(
      await screen.findByRole("heading", { name: "Available Matches:" })
    ).toBeInTheDocument();

    // Verify the <ul> is empty if no matches are returned
    const list = screen.getByRole("list");
    expect(list).toBeEmptyDOMElement();
  });
});
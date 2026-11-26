import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, it } from "vitest";
import CompetitionPage from "../../../app/routes/competitions";
import type { MatchDTO } from "../../../app/dtos/MatchDTO";

it("lists finished matches only in the full schedule", () => {
  const match: MatchDTO = {
    id: 1, homeTeam: "Valencia", awayTeam: "Sevilla",
    matchDate: new Date(Date.now() + 86_400_000).toISOString(),
    homeOdds: null, drawOdds: null, awayOdds: null, gameStatus: "FINISHED",
    homeTeamId: null, awayTeamId: null, competitionId: 1,
  };

  render(<MemoryRouter><CompetitionPage loaderData={{
    id: 1, name: "La Liga", country: "Spain", iconUrl: null,
    sport: { id: 1, name: "Football", iconUrl: null },
    teams: [], matches: [match],
  }} /></MemoryRouter>);

  expect(screen.getByText("No upcoming matches.")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Valencia vs Sevilla/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Finished" }));
  expect(screen.getByRole("link", { name: /Valencia vs Sevilla/ })).toHaveAttribute("href", "/match/1");
  fireEvent.change(screen.getByRole("searchbox", { name: "Find a team" }), { target: { value: "Barcelona" } });
  expect(screen.queryByRole("link", { name: /Valencia vs Sevilla/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
  expect(screen.getByRole("link", { name: /Valencia vs Sevilla/ })).toBeInTheDocument();
});

it("shows competition fixtures ten at a time and restarts pagination when filters change", () => {
  const matches: MatchDTO[] = Array.from({ length: 23 }, (_, index) => ({
    id: index + 1,
    homeTeam: `Home ${index + 1}`,
    awayTeam: `Away ${index + 1}`,
    matchDate: new Date(Date.now() + 86_400_000).toISOString(),
    homeOdds: null,
    drawOdds: null,
    awayOdds: null,
    gameStatus: "SCHEDULED",
    homeTeamId: null,
    awayTeamId: null,
    competitionId: 1,
  }));

  render(<MemoryRouter><CompetitionPage loaderData={{
    id: 1, name: "La Liga", country: "Spain", iconUrl: null,
    sport: { id: 1, name: "Football", iconUrl: null },
    teams: [], matches,
  }} /></MemoryRouter>);

  const fixtures = () => screen.queryAllByRole("link", { name: /Home \d+ vs Away \d+/ });
  const loadMore = () => screen.getByRole("button", { name: "Load more" });
  const search = screen.getByRole("searchbox", { name: "Find a team" });
  expect(fixtures()).toHaveLength(10);

  fireEvent.click(loadMore());
  expect(fixtures()).toHaveLength(20);
  fireEvent.click(loadMore());
  expect(fixtures()).toHaveLength(23);
  expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();

  fireEvent.change(search, { target: { value: "Home 23" } });
  expect(fixtures()).toHaveLength(1);
  expect(screen.getByRole("link", { name: "Home 23 vs Away 23" })).toHaveAttribute("href", "/match/23");
  fireEvent.change(search, { target: { value: "" } });
  expect(fixtures()).toHaveLength(10);
});

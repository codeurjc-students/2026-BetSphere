import { render, screen } from "@testing-library/react";
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
  expect(screen.getByRole("link", { name: /Valencia vs Sevilla/ })).toHaveAttribute("href", "/match/1");
});

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, it } from "vitest";
import MatchPage from "../../../app/routes/match";
import type { TeamDTO } from "../../../app/dtos/TeamDTO";

it("formats available odds and shows a placeholder for missing odds", () => {
  const homeTeam: TeamDTO = {
    id: 1, name: "Real Madrid", country: "Spain", logoUrl: null,
    wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, totalMatches: 0,
  };
  const match = {
    id: 1, homeTeam, awayTeam: { ...homeTeam, id: 2, name: "Barcelona" },
    competition: {
      id: 1, name: "La Liga", country: "Spain", iconUrl: null,
      sport: { id: 1, name: "Football", iconUrl: null },
    },
    matchDate: "2026-12-01T20:00:00Z", gameStatus: "SCHEDULED",
    homeOdds: 2.1, drawOdds: null, awayOdds: 3.2,
  };

  render(<MemoryRouter><MatchPage loaderData={{ match, user: null }} /></MemoryRouter>);

  expect(screen.getByRole("button", { name: "Odds 1 disabled" })).toHaveTextContent("2.10");
  expect(screen.getByRole("button", { name: "Odds X disabled" })).toHaveTextContent("—");
});

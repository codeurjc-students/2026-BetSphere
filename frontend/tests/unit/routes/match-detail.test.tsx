import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, it } from "vitest";
import MatchPage from "../../../app/routes/match";
import type { TeamDTO } from "../../../app/dtos/TeamDTO";

it("formats available odds and shows a placeholder for missing odds", () => {
  const homeTeam: TeamDTO = {
    id: 1, name: "Real Madrid", country: "Spain", logoUrl: null,
    wins: 3, draws: 0, losses: 0, goalsFor: 9, goalsAgainst: 0, totalMatches: 3,
  };
  const match = {
    id: 1, homeTeam, awayTeam: { ...homeTeam, id: 2, name: "Barcelona", goalsFor: 6 },
    competition: {
      id: 1, name: "La Liga", country: "Spain", iconUrl: null,
      sport: { id: 1, name: "Football", iconUrl: null },
    },
    matchDate: "2026-12-01T20:00:00Z", gameStatus: "SCHEDULED",
    homeOdds: 2.1, drawOdds: null, awayOdds: 3.2,
  };

  const { rerender } = render(<MemoryRouter><MatchPage loaderData={{ match, user: null }} /></MemoryRouter>);

  expect(screen.getByRole("button", { name: "Odds 1 disabled" })).toHaveTextContent("2.10");
  expect(screen.getByRole("button", { name: "Odds X disabled" })).toHaveTextContent("—");

  fireEvent.click(screen.getByRole("button", { name: "Goals for" }));
  expect(screen.getByRole("button", { name: "Goals for" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("progressbar", { name: "Real Madrid" })).toHaveAttribute("value", "9");
  expect(screen.getByRole("progressbar", { name: "Barcelona" })).toHaveAttribute("value", "6");

  fireEvent.click(screen.getByRole("button", { name: "Place a bet" }));
  expect(screen.getByText("Sign in to access virtual betting.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/login?returnTo=%2Fmatch%2F1");

  const user = { id: 2, username: "fan", email: "fan@example.test", roles: [], birthDate: "1992-04-02", virtualBalance: 0 };
  rerender(<MemoryRouter><MatchPage loaderData={{ match, user }} /></MemoryRouter>);
  expect(screen.getByText("Virtual betting will be available later.")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Sign In" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Match chat" }));
  expect(screen.getByText("Match chat will be available later.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Generate AI analysis" }));
  expect(screen.getByText("AI analysis will be available later.")).toBeInTheDocument();
});

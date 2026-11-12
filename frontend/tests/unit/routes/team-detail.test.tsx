import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, it } from "vitest";
import TeamPage from "../../../app/routes/team";

it("shows the team's season statistics and links back to its competition", () => {
  render(<MemoryRouter><TeamPage loaderData={{
    team: {
      id: 1, name: "Real Madrid", country: "Spain", logoUrl: null,
      wins: 7, draws: 2, losses: 1, goalsFor: 22, goalsAgainst: 8, totalMatches: 10,
    },
    competition: {
      id: 3, name: "La Liga", country: "Spain", iconUrl: null, teams: [], matches: [],
      sport: { id: 1, name: "Football", iconUrl: null },
    },
  }} /></MemoryRouter>);

  expect(screen.getByRole("heading", { name: "Real Madrid" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /La Liga/ })).toHaveAttribute("href", "/competition/3");
  expect(screen.getByText("Wins").parentElement).toHaveTextContent("7Wins");
  expect(screen.getByText("Goals against").parentElement).toHaveTextContent("8Goals against");
});

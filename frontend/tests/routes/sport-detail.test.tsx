import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, it } from "vitest";
import SportPage from "../../app/routes/sports";

const sport = { id: 1, name: "Football", iconUrl: null };

it("links to the competition belonging to the selected sport", () => {
  render(
    <MemoryRouter>
      <SportPage loaderData={{
        ...sport,
        competitions: [{
          id: 3, name: "La Liga", country: "Spain", iconUrl: null,
          sport, teams: [], matches: [],
        }],
      }} />
    </MemoryRouter>,
  );

  expect(screen.getByRole("heading", { name: "Football" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /La Liga/ })).toHaveAttribute("href", "/competition/3");
});

it("shows an empty state for a sport without competitions", () => {
  render(<MemoryRouter><SportPage loaderData={{ ...sport, competitions: [] }} /></MemoryRouter>);

  expect(screen.getByText("There are no competitions for this sport yet.")).toBeInTheDocument();
});

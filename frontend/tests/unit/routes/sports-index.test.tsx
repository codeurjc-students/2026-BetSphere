import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, it } from "vitest";
import SportsHome from "../../../app/routes/sports-index";

it("links each sport card to the selected sport", () => {
  render(
    <MemoryRouter>
      <SportsHome loaderData={[
        { id: 7, name: "Football", iconUrl: null, competitions: [] },
        { id: 8, name: "Tennis", iconUrl: null, competitions: [] },
      ]} />
    </MemoryRouter>,
  );

  expect(screen.getByText("2 sports available")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Football/ })).toHaveAttribute("href", "/sport/7");
  expect(screen.getByRole("link", { name: /Tennis/ })).toHaveAttribute("href", "/sport/8");
});

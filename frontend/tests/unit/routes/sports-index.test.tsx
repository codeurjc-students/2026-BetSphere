import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, it, vi } from "vitest";
import SportsHome from "../../../app/routes/sports-index";

it("links each sport card to the selected sport", () => {
  render(
    <MemoryRouter>
      <SportsHome loaderData={{ sports: [
        { id: 7, name: "Football", iconUrl: null, competitions: [] },
        { id: 8, name: "Tennis", iconUrl: null, competitions: [] },
      ], matches: [] }} />
    </MemoryRouter>,
  );

  expect(screen.getByText("2 sports available")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Football/ })).toHaveAttribute("href", "/sport/7");
  expect(screen.getByRole("link", { name: /Tennis/ })).toHaveAttribute("href", "/sport/8");
});

it("advances the rail by one sport and stops at the end", () => {
  const sports = ["Football", "Tennis", "Basketball", "Volleyball"].map((name, id) => ({
    id, name, iconUrl: null, competitions: [],
  }));
  render(<MemoryRouter><SportsHome loaderData={{ sports, matches: [] }} /></MemoryRouter>);

  const rail = screen.getByRole("list", { name: "Sports catalog" });
  const scrollBy = vi.fn();
  Object.defineProperties(rail, {
    clientWidth: { value: 900 },
    scrollWidth: { value: 1200 },
    scrollBy: { value: scrollBy },
  });
  vi.spyOn(screen.getAllByRole("listitem")[0], "getBoundingClientRect")
    .mockReturnValue(DOMRect.fromRect({ width: 300 }));
  fireEvent.scroll(rail);

  const previous = screen.getByRole("button", { name: "Previous sport" });
  const next = screen.getByRole("button", { name: "Next sport" });
  expect(previous).toBeDisabled();
  fireEvent.click(next);
  expect(scrollBy).toHaveBeenCalledWith({ left: 300 });

  rail.scrollLeft = 300;
  fireEvent.scroll(rail);
  expect(next).toBeDisabled();
  fireEvent.click(previous);
  expect(scrollBy).toHaveBeenLastCalledWith({ left: -300 });
});

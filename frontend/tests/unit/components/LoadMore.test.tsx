import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import LoadMore from "../../../app/components/LoadMore";

it("requests more results only when it is idle", () => {
  const onClick = vi.fn();
  const { rerender } = render(<LoadMore onClick={onClick} />);
  fireEvent.click(screen.getByRole("button", { name: "Load more" }));
  expect(onClick).toHaveBeenCalledOnce();

  rerender(<LoadMore onClick={onClick} loading />);
  const button = screen.getByRole("button", { name: "Loading…" });
  expect(button).toBeDisabled();
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledOnce();
});

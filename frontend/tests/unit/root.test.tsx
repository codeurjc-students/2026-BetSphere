import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
  useRouteError,
  type RouteObject,
} from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { ErrorBoundary } from "../../app/root";

const activeRouters: ReturnType<typeof createMemoryRouter>[] = [];

function TestErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundary error={error} />;
}

function renderLoaderError(error: unknown) {
  const routes: RouteObject[] = [
    {
      path: "/",
      loader() {
        throw error;
      },
      Component: () => null,
      ErrorBoundary: TestErrorBoundary,
    },
  ];
  const router = createMemoryRouter(routes, { initialEntries: ["/"] });
  activeRouters.push(router);
  render(<RouterProvider router={router} />);
}

afterEach(() => {
  activeRouters.splice(0).forEach((router) => router.dispose());
});

describe("application root", () => {
  it("renders the branded not-found page for a 404 route response", async () => {
    renderLoaderError({
      status: 404,
      statusText: "Not Found",
      internal: true,
      data: "",
    });

    expect(
      await screen.findByRole("heading", {
        name: "This page is not on the scoreboard.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to home/ })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders development details for an unexpected loader error", async () => {
    renderLoaderError(new Error("Unexpected failure at BetSphere"));

    expect(
      await screen.findByRole("heading", {
        name: "We couldn't load this play.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Unexpected failure at BetSphere"),
    ).toBeInTheDocument();
  });
});

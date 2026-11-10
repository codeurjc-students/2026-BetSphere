import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, useLoaderData } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import AdminPage from "../../app/routes/admin";
import type { PageDTO } from "../../app/dtos/PageDTO";
import type { SportDTO } from "../../app/dtos/SportDTO";

function page<T>(content: T[], number = 0, totalElements = content.length): PageDTO<T> {
  return { content, number, size: 1, totalElements, totalPages: totalElements, last: number + 1 >= totalElements };
}

const football: SportDTO = { id: 1, name: "Football", iconUrl: null, competitions: [] };
const tennis: SportDTO = { id: 2, name: "Tennis", iconUrl: null, competitions: [] };
const routers: ReturnType<typeof createMemoryRouter>[] = [];

afterEach(() => {
  routers.splice(0).forEach((router) => router.dispose());
});

function renderAdmin({ allowDeletion = false } = {}) {
  let deleted = false;
  const action = vi.fn(async ({ request }: { request: Request }) => {
    const data = await request.formData();
    const intent = String(data.get("intent"));
    if (allowDeletion && intent === "delete" && data.get("id") === String(football.id)) {
      deleted = true;
      return { ok: true, entity: "sports", intent };
    }
    return { ok: false, intent, error: "The record could not be saved." };
  });
  const loader = ({ request }: { request: Request }) => {
    if (new URL(request.url).searchParams.has("page")) {
      return { kind: "page" as const, entity: "sports", page: page([tennis], 1, 2) };
    }
    return {
      kind: "initial" as const,
      pages: { sports: deleted ? page([tennis]) : page([football], 0, 2), competitions: page([]), matches: page([]), teams: page([]), users: page([]) },
      options: { sports: [football], competitions: [], teams: [], matchDependencies: [] },
    };
  };
  function Route() {
    const loaderData = useLoaderData() as Extract<Awaited<ReturnType<typeof loader>>, { kind: "initial" }>;
    return <AdminPage loaderData={loaderData} />;
  }

  const router = createMemoryRouter([{
    path: "/admin", loader, action, Component: Route, HydrateFallback: () => null,
  }], { initialEntries: ["/admin"] });
  routers.push(router);
  render(<RouterProvider router={router} />);
  return action;
}

it("appends another page and hides creation controls on the Users tab", async () => {
  renderAdmin();
  await screen.findByText("Football");

  fireEvent.click(screen.getByRole("button", { name: "Load more" }));
  expect(await screen.findByText("Tennis")).toBeInTheDocument();
  expect(screen.getByText("Football")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("tab", { name: /Users/ }));
  expect(screen.getByText("No records found yet.")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "New record" })).not.toBeInTheDocument();
});

it("keeps the edit form open and shows the error after a failed save", async () => {
  const action = renderAdmin();
  await screen.findByText("Football");
  fireEvent.click(screen.getByRole("button", { name: "Edit" }));
  const name = screen.getByLabelText("Name");
  expect(name).toHaveValue("Football");
  fireEvent.change(name, { target: { value: "Updated football" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  expect(await screen.findByText("The record could not be saved.")).toBeInTheDocument();
  expect(action).toHaveBeenCalledOnce();
  expect(name).toHaveValue("Updated football");
});

it("lets the administrator cancel a deletion without submitting it", async () => {
  const action = renderAdmin();
  await screen.findByText("Football");
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
  const dialog = screen.getByRole("dialog");
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByText("Football")).toBeInTheDocument();
  expect(action).not.toHaveBeenCalled();
});

it("submits a confirmed deletion and displays the reloaded list", async () => {
  renderAdmin({ allowDeletion: true });
  await screen.findByText("Football");
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Delete" }));

  expect(await screen.findByText("Sports successfully deleted.")).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByText("Football")).not.toBeInTheDocument();
  expect(screen.getByText("Tennis")).toBeInTheDocument();
});

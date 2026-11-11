import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, useLoaderData } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import ProfilePage, { clientAction } from "../../app/routes/profile";
import HistoryPage from "../../app/routes/history";
import { useAuthStore } from "../../app/stores/auth-store";
import type { UserDTO } from "../../app/dtos/UserDTO";

const user: UserDTO = {
  id: 1, username: "fan", email: "fan@example.test",
  roles: ["ROLE_REGISTERED"], birthDate: "1990-01-01", virtualBalance: 42.5,
};
const initialState = useAuthStore.getState();
const routers: ReturnType<typeof createMemoryRouter>[] = [];

afterEach(() => {
  routers.splice(0).forEach((router) => router.dispose());
  useAuthStore.setState(initialState);
  vi.unstubAllGlobals();
});

function renderAccount(action?: () => { avatarUrl: string } | { error: string }) {
  useAuthStore.getState().setSession("test-token", user);
  const router = createMemoryRouter([
    {
      path: "/profile",
      loader: () => user,
      action,
      Component: () => <ProfilePage loaderData={useLoaderData() as UserDTO} />,
      HydrateFallback: () => null,
    },
    {
      path: "/history",
      loader: () => user,
      Component: () => <HistoryPage loaderData={useLoaderData() as UserDTO} />,
      HydrateFallback: () => null,
    },
  ], { initialEntries: ["/profile"] });
  routers.push(router);
  render(<RouterProvider router={router} />);
}

it("shows profile details and opens the user's activity screen", async () => {
  renderAccount();
  expect(await screen.findByRole("heading", { name: "My Profile" })).toBeInTheDocument();
  expect(screen.getAllByText(user.email)).toHaveLength(2);
  expect(screen.getByText("€42.50")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("link", { name: "View my history" }));
  expect(await screen.findByRole("heading", { name: "History" })).toBeInTheDocument();
  expect(screen.getByText("€42.50")).toBeInTheDocument();
  expect(screen.getByText("No activity to display yet")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explore matches" })).toHaveAttribute("href", "/matches");
});

it("updates the profile photo and the current session after uploading", async () => {
  const avatarUrl = "/api/v1/images/new-avatar";
  const upload = vi.fn(() => ({ avatarUrl }));
  renderAccount(upload);
  const file = new File(["image"], "avatar.png", { type: "image/png" });

  fireEvent.change(await screen.findByLabelText("Change photo"), { target: { files: [file] } });

  expect(await screen.findByRole("status")).toHaveTextContent("Profile photo updated.");
  expect(screen.getByRole("img", { name: "fan's photo" })).toHaveAttribute("src", avatarUrl);
  expect(useAuthStore.getState().user?.avatarUrl).toBe(avatarUrl);
  expect(upload).toHaveBeenCalledOnce();
});

it("shows an upload error and keeps the existing avatar", async () => {
  renderAccount(() => ({ error: "Invalid image" }));
  const file = new File(["bad image"], "avatar.png", { type: "image/png" });

  fireEvent.change(await screen.findByLabelText("Change photo"), { target: { files: [file] } });

  expect(await screen.findByRole("alert")).toHaveTextContent("Invalid image");
  expect(useAuthStore.getState().user?.avatarUrl).toBeUndefined();
});

it("sends the avatar as a multipart file to the authenticated API", async () => {
  useAuthStore.getState().setSession("test-token", user);
  const data = new FormData();
  data.append("avatar", new File(["image"], "avatar.png", { type: "image/png" }));
  const request = new Request("http://localhost/profile", { method: "POST" });
  vi.spyOn(request, "formData").mockResolvedValue(data);
  const avatarUrl = "/api/v1/images/new-avatar";
  const fetchMock = vi.fn().mockResolvedValue(Response.json({ url: avatarUrl }));
  vi.stubGlobal("fetch", fetchMock);

  await expect(clientAction({ request } as Parameters<typeof clientAction>[0])).resolves.toEqual({ avatarUrl });
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe("/api/v1/images");
  expect(init.method).toBe("POST");
  expect(init.headers.get("Authorization")).toBe("Bearer test-token");
  expect(init.body.get("file").name).toBe("avatar.png");
});

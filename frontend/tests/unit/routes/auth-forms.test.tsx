import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import LoginPage, { clientAction as loginAction, clientLoader as loginLoader } from "../../../app/routes/login";
import RegisterPage, { clientAction as registerAction } from "../../../app/routes/register";
import { useAuthStore } from "../../../app/stores/auth-store";

const initialState = useAuthStore.getState();
const account = {
  id: 1, username: "fan", email: "fan@example.test", roles: ["ROLE_REGISTERED"],
  birthDate: "1990-01-01", virtualBalance: 0,
};
const routers: ReturnType<typeof createMemoryRouter>[] = [];

beforeEach(() => useAuthStore.getState().clearSession());

afterEach(() => {
  routers.splice(0).forEach((router) => router.dispose());
  useAuthStore.setState(initialState);
  vi.unstubAllGlobals();
});

function renderAuth(path: string) {
  const router = createMemoryRouter([
    {
      path: "/login",
      loader: loginLoader,
      action: (args) => loginAction(args as Parameters<typeof loginAction>[0]),
      Component: LoginPage,
      HydrateFallback: () => null,
    },
    {
      path: "/register",
      action: (args) => registerAction(args as Parameters<typeof registerAction>[0]),
      Component: RegisterPage,
    },
    { path: "/profile", element: <h1>My Profile</h1> },
    { path: "/", element: <h1>Home</h1> },
  ], { initialEntries: [path] });
  routers.push(router);
  render(<RouterProvider router={router} />);
  return router;
}

function fillCredentials() {
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: account.email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "ValidPass1!" } });
}

it("displays validation errors for an empty login without sending a request", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  renderAuth("/login");

  fireEvent.click(await screen.findByRole("button", { name: "Sign In" }));

  expect(await screen.findByText("Enter your email address.")).toBeInTheDocument();
  expect(screen.getByText("Enter your password.")).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});

it("displays the error returned for rejected credentials", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: "Invalid credentials" }, { status: 401 })));
  renderAuth("/login");
  const submit = await screen.findByRole("button", { name: "Sign In" });
  fillCredentials();
  fireEvent.click(submit);

  expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
  expect(useAuthStore.getState().user).toBeNull();
});

it.each([
  ["/profile", "My Profile"],
  ["//example.test", "Home"],
])("signs in and resolves the return destination %s", async (returnTo, heading) => {
  const fetchMock = vi.fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ status: "SUCCESS", accessToken: "access-token" }))
    .mockResolvedValueOnce(Response.json(account));
  vi.stubGlobal("fetch", fetchMock);
  renderAuth("/login?returnTo=" + encodeURIComponent(returnTo));
  const submit = await screen.findByRole("button", { name: "Sign In" });
  fillCredentials();
  fireEvent.click(submit);

  expect(await screen.findByRole("heading", { name: heading })).toBeInTheDocument();
  expect(useAuthStore.getState()).toMatchObject({ accessToken: "access-token", user: account });
  expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/v1/auth/login", expect.objectContaining({
    method: "POST", credentials: "include",
    body: JSON.stringify({ email: account.email, password: "ValidPass1!" }),
  }));
  expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/v1/users/me", expect.anything());
  expect(new Headers(fetchMock.mock.calls[1][1]?.headers).get("Authorization")).toBe("Bearer access-token");
});

it("redirects an already signed-in user away from login", async () => {
  useAuthStore.getState().setSession("access-token", account);
  renderAuth("/login");

  expect(await screen.findByRole("heading", { name: "Home" })).toBeInTheDocument();
});

it("displays registration validation errors without sending a request", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  renderAuth("/register");
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));

  expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
  expect(screen.getByText("Enter your birth date.")).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});

it.each([true, false])("handles registration with success=%s", async (succeeds) => {
  const fetchMock = vi.fn().mockResolvedValue(succeeds
    ? Response.json(account, { status: 201 })
    : Response.json({ error: "Email already registered" }, { status: 409 }));
  vi.stubGlobal("fetch", fetchMock);
  const router = renderAuth("/register");
  fillCredentials();
  fireEvent.change(screen.getByLabelText("Username"), { target: { value: account.username } });
  fireEvent.change(screen.getByLabelText("Birth date"), { target: { value: account.birthDate } });
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));

  if (succeeds) {
    expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(router.state.location.search).toBe("?registered=1");
  } else {
    expect(await screen.findByRole("alert")).toHaveTextContent("Email already registered");
    expect(router.state.location.pathname).toBe("/register");
  }
  expect(fetchMock).toHaveBeenCalledWith("/api/v1/users/", expect.objectContaining({
    method: "POST",
    body: JSON.stringify({
      username: account.username, email: account.email, password: "ValidPass1!", birthDate: account.birthDate,
    }),
  }));
});

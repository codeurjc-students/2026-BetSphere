import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { expect, it, vi } from "vitest";
import Header from "../../app/components/Header";
import { logout } from "../../app/services/auth-service";
import { useAuthStore } from "../../app/stores/auth-store";

vi.mock("../../app/services/auth-service", () => ({ logout: vi.fn() }));

it("clears the client session when the user signs out", async () => {
  vi.mocked(logout).mockResolvedValue(undefined);
  useAuthStore.getState().setSession("test-token", {
    id: 1,
    username: "user",
    email: "user@example.test",
    roles: ["ROLE_REGISTERED"],
    birthDate: "1990-06-15",
    virtualBalance: 0,
  });

  render(<MemoryRouter><Header /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: /log out|sign out|logout/i }));

  await waitFor(() => {
    expect(logout).toHaveBeenCalledOnce();
    expect(useAuthStore.getState()).toMatchObject({ user: null, accessToken: null });
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
  });
});

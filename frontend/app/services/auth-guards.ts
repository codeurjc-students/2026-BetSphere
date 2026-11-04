import { redirect } from "react-router";
import type { UserDTO } from "../dtos/UserDTO";
import { restoreSession, useAuthStore } from "../stores/auth-store";

export async function requireUser({ request }: { request: Request }) {
  await restoreSession();
  const { accessToken, user } = useAuthStore.getState();
  if (!accessToken || !user) {
    const returnTo = new URL(request.url).pathname;
    throw redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
  return user;
}

/** Restores the session when possible, but lets anonymous visitors continue. */
export async function optionalUser(): Promise<UserDTO | null> {
  await restoreSession();
  return useAuthStore.getState().user;
}

export async function requireAdmin(args: { request: Request }) {
  await requireUser(args);
  if (!useAuthStore.getState().user?.roles.includes("ROLE_ADMIN")) {
    throw redirect("/");
  }
}

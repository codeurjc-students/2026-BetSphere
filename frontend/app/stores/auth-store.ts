import { create } from "zustand";
import type { UserDTO } from "../dtos/UserDTO";
import { getCurrentUser, refreshAccessToken } from "../services/auth-service";

type AuthState = {
  accessToken: string | null;
  user: UserDTO | null;
  initialized: boolean;
  setSession: (accessToken: string, user: UserDTO) => void;
  setUser: (user: UserDTO) => void;
  clearSession: () => void;
  setInitialized: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  initialized: false,
  setSession: (accessToken, user) => set({ accessToken, user, initialized: true }),
  setUser: (user) => set({ user }),
  clearSession: () => set({ accessToken: null, user: null, initialized: true }),
  setInitialized: () => set({ initialized: true }),
}));

let restoreInProgress: Promise<void> | undefined;

export function restoreSession() {
  if (useAuthStore.getState().initialized) return Promise.resolve();
  if (restoreInProgress) return restoreInProgress;

  restoreInProgress = (async () => {
    try {
      const accessToken = await refreshAccessToken();
      const user = await getCurrentUser(accessToken);
      useAuthStore.getState().setSession(accessToken, user);
    } catch {
      useAuthStore.getState().clearSession();
    } finally {
      restoreInProgress = undefined;
    }
  })();
  return restoreInProgress;
}

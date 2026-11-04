import { a as refreshAccessToken, n as getCurrentUser } from "./auth-service-DK-smBZq.js";
import { create } from "zustand";
//#region app/stores/auth-store.ts
var useAuthStore = create((set) => ({
	accessToken: null,
	user: null,
	initialized: false,
	setSession: (accessToken, user) => set({
		accessToken,
		user,
		initialized: true
	}),
	clearSession: () => set({
		accessToken: null,
		user: null,
		initialized: true
	}),
	setInitialized: () => set({ initialized: true })
}));
var restoreInProgress;
function restoreSession() {
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
			restoreInProgress = void 0;
		}
	})();
	return restoreInProgress;
}
//#endregion
export { useAuthStore as n, restoreSession as t };

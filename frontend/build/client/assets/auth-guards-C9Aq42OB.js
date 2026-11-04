import { n as useAuthStore, t as restoreSession } from "./auth-store-BqyWjXwj.js";
import { redirect } from "react-router";
//#region app/services/auth-guards.ts
async function requireUser({ request }) {
	await restoreSession();
	const { accessToken, user } = useAuthStore.getState();
	if (!accessToken || !user) {
		const returnTo = new URL(request.url).pathname;
		throw redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
	}
}
/** Restores the session when possible, but lets anonymous visitors continue. */
async function optionalUser() {
	await restoreSession();
	return useAuthStore.getState().user;
}
async function requireAdmin(args) {
	await requireUser(args);
	if (!useAuthStore.getState().user?.roles.includes("ROLE_ADMIN")) throw redirect("/");
}
//#endregion
export { requireAdmin as n, requireUser as r, optionalUser as t };

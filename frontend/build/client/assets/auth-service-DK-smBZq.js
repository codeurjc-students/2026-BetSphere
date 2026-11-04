//#region app/services/auth-service.ts
var AUTH_URL = "/api/v1/auth";
var USERS_URL = "/api/v1/users";
var AuthServiceError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.name = "AuthServiceError";
		this.status = status;
	}
};
async function readErrorMessage(response, fallback) {
	try {
		const body = await response.json();
		if (body && typeof body === "object") {
			const data = body;
			if (typeof data.message === "string") return data.message;
			if (typeof data.error === "string") return data.error;
		}
	} catch {}
	return fallback;
}
async function login(credentials) {
	const response = await fetch(`${AUTH_URL}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(credentials)
	});
	if (!response.ok) throw new AuthServiceError(await readErrorMessage(response, "Could not log in"), response.status);
	const result = await response.json();
	if (result.status !== "SUCCESS" || !result.accessToken) throw new AuthServiceError(result.message || "Could not log in", response.status);
	return result;
}
async function register(details) {
	const response = await fetch(`${USERS_URL}/`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(details)
	});
	if (!response.ok) throw new AuthServiceError(await readErrorMessage(response, "Could not create the account"), response.status);
	return await response.json();
}
async function getCurrentUser(accessToken) {
	const response = await fetch(`${USERS_URL}/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
	if (!response.ok) throw new AuthServiceError(await readErrorMessage(response, "Could not load the user."), response.status);
	return await response.json();
}
async function logout() {
	await fetch(`${AUTH_URL}/logout`, {
		method: "POST",
		credentials: "include"
	});
}
async function refreshAccessToken() {
	const response = await fetch(`${AUTH_URL}/refresh`, {
		method: "POST",
		credentials: "include"
	});
	if (!response.ok) throw new AuthServiceError(await readErrorMessage(response, "Sesion expired."), response.status);
	const result = await response.json();
	if (result.status !== "SUCCESS" || !result.accessToken) throw new AuthServiceError(result.message || "Sesion expired.", response.status);
	return result.accessToken;
}
//#endregion
export { refreshAccessToken as a, logout as i, getCurrentUser as n, register as o, login as r, AuthServiceError as t };

//#region app/services/match-service.ts
var API_URL = "/api/v1/matches";
async function getMatches() {
	const res = await fetch(`${API_URL}/`);
	if (!res.ok) throw new Error("Failed to fetch matches");
	return await res.json();
}
async function getMatchById(id) {
	const res = await fetch(`${API_URL}/${id}`);
	if (!res.ok) throw new Response("Failed to fetch the match", {
		status: res.status,
		statusText: res.statusText
	});
	return res.json();
}
//#endregion
export { getMatches as n, getMatchById as t };

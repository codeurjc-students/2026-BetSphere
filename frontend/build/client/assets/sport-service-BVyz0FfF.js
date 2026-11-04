//#region app/services/sport-service.ts
var API_URL = "/api/v1/sports";
async function getSports() {
	const res = await fetch(`${API_URL}/`);
	if (!res.ok) throw new Error("Failed to fetch sports");
	return res.json();
}
async function getById(id) {
	const res = await fetch(`${API_URL}/${id}`);
	if (!res.ok) throw new Response("Failed to fetch the sport", {
		status: res.status,
		statusText: res.statusText
	});
	return res.json();
}
//#endregion
export { getSports as n, getById as t };

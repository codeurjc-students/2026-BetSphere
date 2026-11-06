import type { MatchDTO } from "../dtos/MatchDTO";
import type { MatchInputDTO } from "../dtos/MatchInputDTO";
import type { MatchViewDTO } from "../dtos/MatchViewDTO";
import type { PageDTO } from "../dtos/PageDTO";
import { adminFetch, adminResponseError } from "./admin-api";

const API_URL = "/api/v1/matches"

export async function getMatches(): Promise<MatchDTO[]>{
    const res = await fetch(`${API_URL}/?page=0&size=10000`);
    if(!res.ok){
        throw new Error("Failed to fetch matches");
    }
    const page = await res.json();
    return Array.isArray(page) ? page : page.content;
}

export async function getMatchesPage(page = 0, size = 10): Promise<PageDTO<MatchDTO>> {
    const res = await fetch(`${API_URL}/?page=${page}&size=${size}`);
    if (!res.ok) throw new Error("Failed to fetch matches");
    return res.json();
}

export async function getMatchById(id: number): Promise<MatchViewDTO> {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
        throw new Response("Failed to fetch the match", {
            status: res.status,
            statusText: res.statusText,
        });
    }
    return res.json();
}

export async function getByCompetition(competitionId: number): Promise<MatchDTO[]> {
    const res = await fetch(`${API_URL}/by-competition/${competitionId}`);
    if (!res.ok) {
        throw new Error("Failed to fetch matches for the competition");
    }
    return res.json();
}

export async function addMatch(match: MatchInputDTO): Promise<MatchDTO> {
    const res = await adminFetch(`${API_URL}/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(match) });
    if (!res.ok) throw new Error("No se pudo crear el partido");
    return res.json();
}

export async function updateMatch(id: number, match: MatchInputDTO): Promise<MatchDTO> {
    const res = await adminFetch(`${API_URL}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(match) });
    if (!res.ok) throw new Error("No se pudo actualizar el partido");
    return res.json();
}

export async function deleteMatch(id: number): Promise<void> {
    const res = await adminFetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await adminResponseError(res, "No se pudo borrar el partido"));
}

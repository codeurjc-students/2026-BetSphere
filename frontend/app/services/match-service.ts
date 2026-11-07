import type { MatchDTO } from "../dtos/MatchDTO";
import type { MatchInputDTO } from "../dtos/MatchInputDTO";
import type { MatchViewDTO } from "../dtos/MatchViewDTO";
import type { PageDTO } from "../dtos/PageDTO";
import { apiFetch, throwRouteResponse } from "./api-client";

const API_URL = "/api/v1/matches"

export async function getMatches(): Promise<MatchDTO[]>{
    const res = await apiFetch(`${API_URL}/?page=0&size=10000`);
    const page = await res.json();
    return Array.isArray(page) ? page : page.content;
}

export async function getMatchesPage(page = 0, size = 10): Promise<PageDTO<MatchDTO>> {
    const res = await apiFetch(`${API_URL}/?page=${page}&size=${size}`);
    return res.json();
}

export async function getMatchById(id: number): Promise<MatchViewDTO> {
    try {
        const res = await apiFetch(`${API_URL}/${id}`);
        return res.json();
    } catch (error) {
        throwRouteResponse(error, "No se pudo cargar el partido.");
    }
}

export async function getByCompetition(competitionId: number): Promise<MatchDTO[]> {
    const res = await apiFetch(`${API_URL}/by-competition/${competitionId}`);
    return res.json();
}

export async function addMatch(match: MatchInputDTO): Promise<MatchDTO> {
    const res = await apiFetch(`${API_URL}/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(match) });
    return res.json();
}

export async function updateMatch(id: number, match: MatchInputDTO): Promise<MatchDTO> {
    const res = await apiFetch(`${API_URL}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(match) });
    return res.json();
}

export async function deleteMatch(id: number): Promise<void> {
    await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
}

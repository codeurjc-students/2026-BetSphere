import type { CompetitionDTO } from "../dtos/CompetitionDTO";
import type { CompetitionInputDTO } from "../dtos/CompetitionInputDTO";
import type { TeamDTO } from "../dtos/TeamDTO";
import type { TeamInputDTO } from "../dtos/TeamInputDTO";
import type { CompetitionSummaryDTO } from "../dtos/CompetitionSummaryDTO";
import { apiFetch, throwRouteResponse } from "./api-client";
import type { PageDTO } from "../dtos/PageDTO";

const API_URL = "/api/v1/competitions"

export async function uploadCompetitionImage(id: number, file: File): Promise<string> {
    const data = new FormData(); data.append("file", file);
    const res = await apiFetch(`${API_URL}/${id}/image`, { method: "POST", body: data });
    return (await res.json()).url;
}

export async function getCompetitions(): Promise<CompetitionDTO[]>{
    const res = await apiFetch(`${API_URL}/?page=0&size=10000`)
    const page = await res.json();
    return Array.isArray(page) ? page : page.content;
}

export async function getCompetitionOptions(): Promise<CompetitionSummaryDTO[]> {
    const res = await apiFetch(`${API_URL}/options?page=0&size=10000`);
    const page = await res.json();
    return Array.isArray(page) ? page : page.content;
}

export async function getCompetitionsPage(page = 0, size = 10): Promise<PageDTO<CompetitionDTO>> {
    const res = await apiFetch(`${API_URL}/?page=${page}&size=${size}`);
    return res.json();
}

export async function getById(id: number): Promise<CompetitionDTO>{
    try {
        const res = await apiFetch(`${API_URL}/${id}`);
        return res.json();
    } catch (error) {
        throwRouteResponse(error, "No se pudo cargar la competición.");
    }
}

export async function getBySport(sportId: number): Promise<CompetitionDTO[]> {
    const res = await apiFetch(`${API_URL}/by-sport/${sportId}`);
    return res.json();
}

export async function addCompetition(competition: CompetitionInputDTO): Promise<CompetitionDTO> {
    const res = await apiFetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(competition),
    });
    return res.json();
}

export async function updateCompetition(id: number, competition: CompetitionInputDTO): Promise<CompetitionDTO> {
    const res = await apiFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(competition),
    });
    return res.json();
}

export async function deleteCompetition(id: number): Promise<void> {
    await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
}

export async function createTeam(competitionId: number, team: TeamInputDTO): Promise<TeamDTO> {
    const res = await apiFetch(`${API_URL}/${competitionId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(team),
    });
    return res.json();
}

export async function addExistingTeam(competitionId: number, teamId: number): Promise<CompetitionDTO> {
    const res = await apiFetch(`${API_URL}/${competitionId}/teams/${teamId}`, { method: "POST" });
    return res.json();
}

export async function removeTeam(competitionId: number, teamId: number): Promise<void> {
    await apiFetch(`${API_URL}/${competitionId}/teams/${teamId}`, { method: "DELETE" });
}

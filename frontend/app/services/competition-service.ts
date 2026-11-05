import type { CompetitionDTO } from "../dtos/CompetitionDTO";
import type { CompetitionInputDTO } from "../dtos/CompetitionInputDTO";
import type { TeamDTO } from "../dtos/TeamDTO";
import type { TeamInputDTO } from "../dtos/TeamInputDTO";
import { adminFetch, adminResponseError } from "./admin-api";

const API_URL = "/api/v1/competitions"

export async function uploadCompetitionImage(id: number, file: File): Promise<string> {
    const data = new FormData(); data.append("file", file);
    const res = await adminFetch(`${API_URL}/${id}/image`, { method: "POST", body: data });
    if (!res.ok) throw new Error(await adminResponseError(res, `No se pudo subir la imagen (${res.status})`));
    return (await res.json()).url;
}

export async function getCompetitions(): Promise<CompetitionDTO[]>{
    const res = await fetch(`${API_URL}/`)
    if(!res.ok){
        throw new Error("Failed to fetch competitions")
    }
    return res.json();
}

export async function getById(id: number): Promise<CompetitionDTO>{
    const res = await fetch(`${API_URL}/${id}`)
    if(!res.ok){
        throw new Response("Failed to fetch the competition", {
            status: res.status,
            statusText: res.statusText,
        })
    }
    return res.json();
}

export async function getBySport(sportId: number): Promise<CompetitionDTO[]> {
    const res = await fetch(`${API_URL}/by-sport/${sportId}`);
    if (!res.ok) {
        throw new Error("Failed to fetch competitions for the sport");
    }
    return res.json();
}

export async function addCompetition(competition: CompetitionInputDTO): Promise<CompetitionDTO> {
    const res = await adminFetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(competition),
    });
    if (!res.ok) throw new Error("Failed to add competition");
    return res.json();
}

export async function updateCompetition(id: number, competition: CompetitionInputDTO): Promise<CompetitionDTO> {
    const res = await adminFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(competition),
    });
    if (!res.ok) throw new Error("Failed to update competition");
    return res.json();
}

export async function deleteCompetition(id: number): Promise<void> {
    const res = await adminFetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await adminResponseError(res, "No se pudo borrar la competición"));
}

export async function createTeam(competitionId: number, team: TeamInputDTO): Promise<TeamDTO> {
    const res = await adminFetch(`${API_URL}/${competitionId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(team),
    });
    if (!res.ok) throw new Error("Failed to create team for competition");
    return res.json();
}

export async function addExistingTeam(competitionId: number, teamId: number): Promise<CompetitionDTO> {
    const res = await adminFetch(`${API_URL}/${competitionId}/teams/${teamId}`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to add team to competition");
    return res.json();
}

export async function removeTeam(competitionId: number, teamId: number): Promise<void> {
    const res = await adminFetch(`${API_URL}/${competitionId}/teams/${teamId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await adminResponseError(res, "No se pudo desvincular el equipo de la competición"));
}

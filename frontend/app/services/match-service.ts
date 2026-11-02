import type { MatchDTO } from "../dtos/MatchDTO";

const API_URL = "/api/v1/matches"

export async function getMatches(): Promise<MatchDTO[]>{
    const res = await fetch(`${API_URL}/`);
    if(!res.ok){
        throw new Error("Failed to fetch matches");
    }
    return await res.json();
}

export async function getById(id: number): Promise<MatchDTO> {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch the match");
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

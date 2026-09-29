import type { MatchDTO } from "../dtos/MatchDTO";

const API_URL = "/api/v1/matches"

export async function getMatches(): Promise<MatchDTO[]>{
    const res = await fetch(`${API_URL}/`);
    if(!res.ok){
        throw new Error("Failed to fetch matches");
    }
    return await res.json();
}
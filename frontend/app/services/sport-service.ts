import type { SportDTO } from "../dtos/SportDTO";
import type { SportInputDTO } from "../dtos/SportInputDTO";
import type { SportSummaryDTO } from "../dtos/SportSummaryDTO";
import type { PageDTO } from "../dtos/PageDTO";
import { apiFetch, throwRouteResponse } from "./api-client";

const API_URL = "/api/v1/sports";

export async function getSports(): Promise<SportDTO[]>{
    const res = await apiFetch(`${API_URL}/?page=0&size=10000`);
    const page = await res.json();
    return Array.isArray(page) ? page : page.content;
}

export async function getSportOptions(): Promise<SportSummaryDTO[]> {
    const res = await apiFetch(`${API_URL}/options?page=0&size=10000`);
    const page = await res.json();
    return Array.isArray(page) ? page : page.content;
}

export async function getSportsPage(page = 0, size = 10): Promise<PageDTO<SportDTO>> {
    const res = await apiFetch(`${API_URL}/?page=${page}&size=${size}`);
    return res.json();
}

export async function getById(id: number): Promise<SportDTO>{
    try {
        const res = await apiFetch(`${API_URL}/${id}`);
        return res.json();
    } catch (error) {
        throwRouteResponse(error, "No se pudo cargar el deporte.");
    }
}

export async function addSport(sport: SportInputDTO): Promise<SportDTO>{
    const res = await apiFetch(`${API_URL}/`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sport),
    });
    return res.json();
}

export async function uploadSportImage(id: number, file: File): Promise<string> {
    const data = new FormData(); data.append("file", file);
    const res = await apiFetch(`${API_URL}/${id}/image`, { method: "POST", body: data });
    return (await res.json()).url;
}

export async function updateSport(id: number, sport: SportInputDTO): Promise<SportDTO>{
    const res = await apiFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sport),
    });
    return res.json();
}

export async function deleteSport(id: number): Promise<void>{
    await apiFetch(`${API_URL}/${id}`,{
        method: "DELETE",
    });
}

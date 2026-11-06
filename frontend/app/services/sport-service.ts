import type { SportDTO } from "../dtos/SportDTO";
import type { SportInputDTO } from "../dtos/SportInputDTO";
import type { PageDTO } from "../dtos/PageDTO";
import { adminFetch, adminResponseError } from "./admin-api";

const API_URL = "/api/v1/sports";

export async function getSports(): Promise<SportDTO[]>{
    const res = await fetch(`${API_URL}/?page=0&size=10000`);
    if(!res.ok){
        throw new Error("Failed to fetch sports");
    }
    const page = await res.json();
    return Array.isArray(page) ? page : page.content;
}

export async function getSportsPage(page = 0, size = 10): Promise<PageDTO<SportDTO>> {
    const res = await fetch(`${API_URL}/?page=${page}&size=${size}`);
    if (!res.ok) throw new Error("Failed to fetch sports");
    return res.json();
}

export async function getById(id: number): Promise<SportDTO>{
    const res = await fetch(`${API_URL}/${id}`);
    if(!res.ok){
        throw new Response("Failed to fetch the sport", {
            status: res.status,
            statusText: res.statusText,
        });
    }
    return res.json();
}

export async function addSport(sport: SportInputDTO): Promise<SportDTO>{
    const res = await adminFetch(`${API_URL}/`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sport),
    });
    if(!res.ok){
        throw new Error("Failed to add Sport");
    }
    return res.json();
}

export async function uploadSportImage(id: number, file: File): Promise<string> {
    const data = new FormData(); data.append("file", file);
    const res = await adminFetch(`${API_URL}/${id}/image`, { method: "POST", body: data });
    if (!res.ok) throw new Error(await adminResponseError(res, `No se pudo subir la imagen (${res.status})`));
    return (await res.json()).url;
}

export async function updateSport(id: number, sport: SportInputDTO): Promise<SportDTO>{
    const res = await adminFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sport),
    });
    if(!res.ok){
        throw new Error("Failed to update sport");
    }
    return res.json();
}

export async function deleteSport(id: number): Promise<void>{
    const res = await adminFetch(`${API_URL}/${id}`,{
        method: "DELETE",
    });
    if(!res.ok){
        throw new Error(await adminResponseError(res, "No se pudo borrar el deporte"));
    }

}

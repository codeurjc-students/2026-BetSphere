import type { SportDTO } from "../dtos/SportDTO";

const API_URL = "/api/v1/sports";

export async function getSports(): Promise<SportDTO[]>{
    const res = await fetch(`${API_URL}/`);
    if(!res.ok){
        throw new Error("Failed to fetch sports");
    }
    return res.json();
}

export async function getById(id: number): Promise<SportDTO>{
    const res = await fetch(`${API_URL}/${id}`);
    if(!res.ok){
        throw new Error("Failed to fetch the sport");
    }
    return res.json();
}

export async function addSport(name: string, iconUrl?: string | null): Promise<SportDTO>{
    const res = await fetch(`${API_URL}/`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, iconUrl }),
    });
    if(!res.ok){
        throw new Error("Failed to add Sport");
    }
    return res.json();
}

//TODO: upload sport image

export async function updateSport(id: number, name: string, iconUrl?: string | null): Promise<SportDTO>{
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, iconUrl }),
    });
    if(!res.ok){
        throw new Error("Failed to update sport");
    }
    return res.json();
}

export async function deleteSport(id: number): Promise<void>{
    const res = await fetch(`${API_URL}/${id}`,{
        method: "DELETE",
    });
    if(!res.ok){
        throw new Error("Failed to delete Sport");
    }

}

import type { TeamDTO } from "../dtos/TeamDTO";
import type { TeamInputDTO } from "../dtos/TeamInputDTO";
import { apiFetch, throwRouteResponse } from "./api-client";
import type { PageDTO } from "../dtos/PageDTO";

const API_URL = "/api/v1/teams";

export async function getTeam(id: number): Promise<TeamDTO> {
  try {
    const response = await apiFetch(`${API_URL}/${id}`);
    return response.json();
  } catch (error) {
    throwRouteResponse(error, "No se pudo cargar el equipo.");
  }
}

export async function uploadTeamImage(id: number, file: File): Promise<string> {
  const data = new FormData(); data.append("file", file);
  const response = await apiFetch(`${API_URL}/${id}/image`, { method: "POST", body: data });
  return (await response.json()).url;
}

export async function getTeams(): Promise<TeamDTO[]> {
  const response = await apiFetch(`${API_URL}/?page=0&size=10000`);
  const page = await response.json();
  return Array.isArray(page) ? page : page.content;
}

export async function getTeamsPage(page = 0, size = 10): Promise<PageDTO<TeamDTO>> {
  const response = await apiFetch(`${API_URL}/?page=${page}&size=${size}`);
  return response.json();
}

export async function updateTeam(id: number, team: TeamInputDTO): Promise<TeamDTO> {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(team),
  });
  return response.json();
}

export async function deleteTeam(id: number): Promise<void> {
  await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
}

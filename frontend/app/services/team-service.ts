import type { TeamDTO } from "../dtos/TeamDTO";
import type { TeamInputDTO } from "../dtos/TeamInputDTO";
import { apiFetch, responseError } from "./api-client";
import type { PageDTO } from "../dtos/PageDTO";

const API_URL = "/api/v1/teams";

export async function getTeam(id: number): Promise<TeamDTO> {
  const response = await apiFetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Response("No se pudo cargar el equipo", { status: response.status });
  return response.json();
}

export async function uploadTeamImage(id: number, file: File): Promise<string> {
  const data = new FormData(); data.append("file", file);
  const response = await apiFetch(`${API_URL}/${id}/image`, { method: "POST", body: data });
  if (!response.ok) throw new Error(await responseError(response, `No se pudo subir la imagen (${response.status})`));
  return (await response.json()).url;
}

export async function getTeams(): Promise<TeamDTO[]> {
  const response = await apiFetch(`${API_URL}/?page=0&size=10000`);
  if (!response.ok) throw new Error("No se pudieron cargar los equipos");
  const page = await response.json();
  return Array.isArray(page) ? page : page.content;
}

export async function getTeamsPage(page = 0, size = 10): Promise<PageDTO<TeamDTO>> {
  const response = await apiFetch(`${API_URL}/?page=${page}&size=${size}`);
  if (!response.ok) throw new Error("No se pudieron cargar los equipos");
  return response.json();
}

export async function updateTeam(id: number, team: TeamInputDTO): Promise<TeamDTO> {
  const response = await apiFetch(`${API_URL}/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(team),
  });
  if (!response.ok) throw new Error(await responseError(response, "No se pudo actualizar el equipo"));
  return response.json();
}

export async function deleteTeam(id: number): Promise<void> {
  const response = await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await responseError(response, "No se pudo borrar el equipo"));
}

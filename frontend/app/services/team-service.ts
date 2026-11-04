import type { TeamDTO } from "../dtos/TeamDTO";
import type { TeamInputDTO } from "../dtos/TeamInputDTO";
import { adminFetch, adminResponseError } from "./admin-api";

const API_URL = "/api/v1/teams";

export async function getTeams(): Promise<TeamDTO[]> {
  // The endpoint is pageable. A large page keeps the current admin view unpaginated.
  const response = await fetch(`${API_URL}/?page=0&size=10000`);
  if (!response.ok) throw new Error("No se pudieron cargar los equipos");
  const page = await response.json();
  return Array.isArray(page) ? page : page.content;
}

export async function updateTeam(id: number, team: TeamInputDTO): Promise<TeamDTO> {
  const response = await adminFetch(`${API_URL}/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(team),
  });
  if (!response.ok) throw new Error(await adminResponseError(response, "No se pudo actualizar el equipo"));
  return response.json();
}

export async function deleteTeam(id: number): Promise<void> {
  const response = await adminFetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await adminResponseError(response, "No se pudo borrar el equipo"));
}

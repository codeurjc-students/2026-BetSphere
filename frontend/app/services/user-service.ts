import type { UserDTO } from "../dtos/UserDTO";
import { apiFetch } from "./api-client";
import type { PageDTO } from "../dtos/PageDTO";

export async function getUsers(): Promise<UserDTO[]> {
  const response = await apiFetch("/api/v1/users/?page=0&size=10000");
  if (!response.ok) throw new Error("No se pudo cargar el listado de usuarios");
  const page = await response.json();
  return Array.isArray(page) ? page : page.content;
}

export async function getUsersPage(page = 0, size = 10): Promise<PageDTO<UserDTO>> {
  const response = await apiFetch(`/api/v1/users/?page=${page}&size=${size}`);
  if (!response.ok) throw new Error("No se pudo cargar el listado de usuarios");
  return response.json();
}

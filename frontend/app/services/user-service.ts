import type { UserDTO } from "../dtos/UserDTO";
import { adminFetch } from "./admin-api";

export async function getUsers(): Promise<UserDTO[]> {
  const response = await adminFetch("/api/v1/users/?page=0&size=10000");
  if (!response.ok) throw new Error("No se pudo cargar el listado de usuarios");
  const page = await response.json();
  return Array.isArray(page) ? page : page.content;
}

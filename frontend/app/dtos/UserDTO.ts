export interface UserDTO {
  id: number;
  username: string;
  email: string;
  roles: string[];
  birthDate: string;
  virtualBalance: number;
  avatarUrl?: string | null;
}

export interface AuthResponseDTO {
  status: "SUCCESS" | "FAILURE";
  message: string;
  accessToken?: string;
}

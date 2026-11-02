export interface TeamDTO {
    id: number;
    name: string;
    country: string;
    logoUrl: string | null;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    totalMatches: number;
}

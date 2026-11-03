import type { SportSummaryDTO } from "./SportSummaryDTO";

export interface CompetitionSummaryDTO {
    id: number;
    name: string;
    country: string;
    iconUrl: string | null;
    sport: SportSummaryDTO;
}

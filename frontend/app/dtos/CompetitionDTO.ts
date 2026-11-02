import type { MatchDTO } from "./MatchDTO";
import type { SportSummaryDTO } from "./SportSummaryDTO";

export interface CompetitionDTO{
    id: number;
    name: string;
    country: string;
    iconUrl: string | null;
    sport: SportSummaryDTO;
    matches: MatchDTO[];
}




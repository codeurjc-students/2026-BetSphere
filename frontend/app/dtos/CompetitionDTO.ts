import type { MatchDTO } from "./MatchDTO";
import type { SportSummaryDTO } from "./SportSummaryDTO";
import type { TeamDTO } from "./TeamDTO";

export interface CompetitionDTO{
    id: number;
    name: string;
    country: string;
    iconUrl: string | null;
    sport: SportSummaryDTO;
    teams: TeamDTO[];
    matches: MatchDTO[];
}




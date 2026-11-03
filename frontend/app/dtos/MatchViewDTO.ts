import type { CompetitionSummaryDTO } from "./CompetitionSummaryDTO";
import type { TeamDTO } from "./TeamDTO";

export interface MatchViewDTO {
    id: number;
    homeTeam: TeamDTO;
    awayTeam: TeamDTO;
    matchDate: string;
    homeOdds: number | null;
    drawOdds: number | null;
    awayOdds: number | null;
    gameStatus: string;
    competition: CompetitionSummaryDTO;
}

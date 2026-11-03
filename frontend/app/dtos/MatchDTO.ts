export interface MatchDTO {
    id: number;
    homeTeam: string;
    awayTeam: string;
    matchDate: string;
    homeOdds: number | null;
    drawOdds: number | null;
    awayOdds: number | null;
    gameStatus: string;
    homeTeamId: number | null;
    awayTeamId: number | null;
    competitionId: number | null;
}

package es.codeurjc.betsphere.dto;

import java.time.LocalDateTime;

/** Detailed read model for the match page. MatchDTO remains the write/list contract. */
public record MatchDetailDTO(
        Long id,
        TeamDTO homeTeam,
        TeamDTO awayTeam,
        LocalDateTime matchDate,
        Double homeOdds,
        Double drawOdds,
        Double awayOdds,
        String gameStatus,
        CompetitionSummaryDTO competition
) {}

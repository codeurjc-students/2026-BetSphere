package es.codeurjc.betsphere.dto;
import java.time.LocalDateTime;

public record MatchDTO(
        Long id,
        String homeTeam,
        String awayTeam,
        LocalDateTime matchDate,
        Double homeOdds,
        Double drawOdds,
        Double awayOdds,
        String status
) {
}

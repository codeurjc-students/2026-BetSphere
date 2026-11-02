package es.codeurjc.betsphere.dto;

import java.util.List;

public record CompetitionDTO(
    Long id, String name, String country, String iconUrl, SportSummaryDTO sport, List<TeamDTO> teams, List<MatchDTO> matches
){
    
}

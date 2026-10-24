package es.codeurjc.betsphere.dto;

import java.util.List;

public record CompetitionDTO(
    Long id, String name, String country, SportDTO sport, List<MatchDTO> matches
){
    
}

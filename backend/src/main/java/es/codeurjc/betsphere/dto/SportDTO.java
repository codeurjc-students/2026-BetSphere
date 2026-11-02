package es.codeurjc.betsphere.dto;

import java.util.List;

public record SportDTO(
    Long id, String name, String iconUrl, List<CompetitionDTO> competitions
) {
    
}

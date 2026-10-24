package es.codeurjc.betsphere.dto;

public record TeamDTO (
    Long id,
    String name,
    String country,
    String logoUrl,
    int wins,
    int draws,
    int losses,
    int goalsFor,
    int goalsAgainst,
    int totalMatches
){
    
}

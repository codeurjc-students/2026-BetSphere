package es.codeurjc.betsphere.dto;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import es.codeurjc.betsphere.model.Match;

@Mapper(componentModel = "spring")
public interface MatchMapper {

    @Mapping(target = "homeTeamId", source = "homeTeamRef.id")
    @Mapping(target = "awayTeamId", source = "awayTeamRef.id")
    @Mapping(target = "competitionId", source = "competition.id")
    MatchDTO toDTO(Match match);

    @Mapping(target = "homeTeamRef.id", source = "homeTeamId")
    @Mapping(target = "awayTeamRef.id", source = "awayTeamId")
    @Mapping(target = "competition.id", source = "competitionId")
    Match toEntity(MatchDTO dto);

    List<MatchDTO> toDTOs(List<Match> matches);
}

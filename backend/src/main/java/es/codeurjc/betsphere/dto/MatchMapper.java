package es.codeurjc.betsphere.dto;

import java.util.List;

import org.mapstruct.Mapper;

import es.codeurjc.betsphere.model.Match;

@Mapper(componentModel = "spring")
public interface MatchMapper {

    MatchDTO toDTO(Match match);

    Match toEntity(MatchDTO dto);

    List<MatchDTO> toDTOs(List<Match> matches);
}

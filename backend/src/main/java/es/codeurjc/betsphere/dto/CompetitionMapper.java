package es.codeurjc.betsphere.dto;

import org.mapstruct.Mapper;

import es.codeurjc.betsphere.model.Competition;

@Mapper(componentModel = "spring", uses = MatchMapper.class)
public interface CompetitionMapper {
    
    CompetitionDTO toDTO(Competition competition);

    Competition toEntity(CompetitionBasicInfoDTO competitionBasicInfoDTO);
}

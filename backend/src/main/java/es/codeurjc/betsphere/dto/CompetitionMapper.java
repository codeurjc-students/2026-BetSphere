package es.codeurjc.betsphere.dto;

import org.mapstruct.Mapper;

import es.codeurjc.betsphere.model.Competition;

@Mapper(componentModel = "spring")
public interface CompetitionMapper {
    
    CompetitionDTO toDTO(Competition competition);

    Competition toEntity(CompetitionBasicInfoDTO competitionBasicInfoDTO);
}

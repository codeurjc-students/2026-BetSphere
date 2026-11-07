package es.codeurjc.betsphere.dto;

import org.mapstruct.Mapper;

import es.codeurjc.betsphere.model.Competition;

@Mapper(componentModel = "spring", uses = {MatchMapper.class, SportSummaryMapper.class, TeamMapper.class})
public interface CompetitionMapper {
    
    CompetitionDTO toDTO(Competition competition);

    CompetitionSummaryDTO toSummaryDTO(Competition competition);

    Competition toEntity(CompetitionBasicInfoDTO competitionBasicInfoDTO);
}

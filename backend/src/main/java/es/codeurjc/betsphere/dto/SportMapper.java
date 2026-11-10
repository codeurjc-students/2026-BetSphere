package es.codeurjc.betsphere.dto;

import org.mapstruct.Mapper;

import es.codeurjc.betsphere.model.Sport;

@Mapper(componentModel = "spring", uses = CompetitionMapper.class)
public interface SportMapper {
    SportDTO toDTO(Sport sport);
    SportSummaryDTO toSummaryDTO(Sport sport);
    Sport toEntity(SportBasicInfoDTO dto);
}

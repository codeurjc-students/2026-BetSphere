package es.codeurjc.betsphere.dto;

import org.mapstruct.Mapper;

import es.codeurjc.betsphere.model.Sport;

@Mapper(componentModel = "spring")
public interface SportSummaryMapper {
    SportSummaryDTO toDTO(Sport sport);
}

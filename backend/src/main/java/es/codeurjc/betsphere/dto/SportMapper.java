package es.codeurjc.betsphere.dto;

import org.mapstruct.Mapper;

import es.codeurjc.betsphere.model.Sport;

@Mapper(componentModel = "spring")
public interface SportMapper {
    SportDTO toDTO(Sport sport);
    Sport toEntity(SportBasicInfoDTO dto);
}

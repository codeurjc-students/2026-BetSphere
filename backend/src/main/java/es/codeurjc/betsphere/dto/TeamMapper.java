package es.codeurjc.betsphere.dto;

import org.mapstruct.Mapper;

import es.codeurjc.betsphere.model.Team;



@Mapper(componentModel = "spring")
public interface TeamMapper {
    
    TeamDTO toDTO(Team team);
    Team toEntity(TeamDTO dto);
    Team toEntity(TeamBasicInfoDTO dto);


}

package es.codeurjc.betsphere.dto;

import java.util.List;

import org.mapstruct.Mapper;

import es.codeurjc.betsphere.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(User user);

    UserRegisterDTO toRegisterDTO(User user);

    User toDomain(UserDTO userDTO);

    User toEntity(UserRegisterDTO userRegisterDTO);
    
    List<UserDTO> toDTOs(List<User> users);

    User toEntity(UserUpdateDTO dto);
}

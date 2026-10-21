package es.codeurjc.betsphere.dto;

import java.time.LocalDate;
import java.util.List;

public record UserDTO(
    Long id,
    String username,
    String email,
    List<String> roles,
    LocalDate birthDate,
    Double virtualBalance
){
    
}

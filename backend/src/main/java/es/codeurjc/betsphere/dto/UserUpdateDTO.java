package es.codeurjc.betsphere.dto;

import java.time.LocalDate;

public record UserUpdateDTO(
    String username,
    String password,
    LocalDate birthDate
){
    
}

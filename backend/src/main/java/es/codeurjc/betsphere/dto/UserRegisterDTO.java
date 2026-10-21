package es.codeurjc.betsphere.dto;

import java.time.LocalDate;

public record UserRegisterDTO(
    String username,
    String email,
    String password,
    LocalDate birthDate
) {
    
}

package es.codeurjc.betsphere.controller;

import java.net.URI;
import java.security.Principal;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequest;

import es.codeurjc.betsphere.dto.UserDTO;
import es.codeurjc.betsphere.dto.UserMapper;
import es.codeurjc.betsphere.dto.UserRegisterDTO;
import es.codeurjc.betsphere.dto.UserUpdateDTO;
import es.codeurjc.betsphere.model.User;
import es.codeurjc.betsphere.service.UserService;

@RestController 
@RequestMapping("/api/v1/users")
public class UserRestController {
    
    private final UserService userService;

    private final UserMapper mapper;

    public UserRestController(UserService userService, UserMapper mapper){
        this.userService = userService;
        this.mapper = mapper;
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id, Authentication authentication) {
        User requestedUser = userService.getUser(id);

        // Resource Ownership Authorization
        boolean isOwner = requestedUser.getEmail().equals(authentication.getName());
        
        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view this profile.");
        }

        return mapper.toDTO(requestedUser);
    }

    @GetMapping("/me")
    public UserDTO getUserLogged(Principal principal) {
        if (principal != null) {
            User user = userService.getByEmail(principal.getName());
            return mapper.toDTO(user);
        } else {
            throw new NoSuchElementException();
        }
    }


    @PostMapping("/")
    public ResponseEntity<?> createUser(@RequestBody UserRegisterDTO userDTO){
        try{
            User createdUser = userService.register(mapper.toEntity(userDTO));
            UserDTO newUserDTO = mapper.toDTO(createdUser);
            URI location = fromCurrentRequest().path("/{id}").buildAndExpand(newUserDTO.id()).toUri();

            return ResponseEntity.created(location).body(userDTO);
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO updateDTO, Authentication authentication) {
        try {
            // 1. Buscamos al usuario para comprobar si es el dueño
            User requestedUser = userService.getUser(id);
            
            boolean isOwner = requestedUser.getEmail().equals(authentication.getName());
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You are not authorized to update this profile."));
            }

            User partialUser = mapper.toEntity(updateDTO);
            User updatedUser = userService.update(id, partialUser);
            return ResponseEntity.ok(mapper.toDTO(updatedUser));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        try {
            User requestedUser = userService.getUser(id);
            
            boolean isOwner = requestedUser.getEmail().equals(authentication.getName());
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You are not authorized to delete this profile."));
            }

            userService.delete(id);
            return ResponseEntity.noContent().build(); // 204 No Content

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllUsers(Pageable pageable, Authentication authentication) {

        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied. Only administrators can view the user list."));
        }

        Page<User> usersPage = userService.getAllUsers(pageable);
        Page<UserDTO> dtoPage = usersPage.map(mapper::toDTO);

        return ResponseEntity.ok(dtoPage);
    }

}

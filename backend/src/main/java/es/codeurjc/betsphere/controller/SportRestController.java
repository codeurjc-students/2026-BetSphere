package es.codeurjc.betsphere.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequest;

import es.codeurjc.betsphere.dto.SportBasicInfoDTO;
import es.codeurjc.betsphere.dto.SportDTO;
import es.codeurjc.betsphere.dto.SportMapper;
import es.codeurjc.betsphere.model.Sport;
import es.codeurjc.betsphere.service.SportService;

@RestController 
@RequestMapping("/api/v1/sports")
public class SportRestController {

    private final SportService sportService;
    private final SportMapper mapper;

    public SportRestController(SportService sportService, SportMapper mapper) {
        this.sportService = sportService;
        this.mapper = mapper;
    }

    @GetMapping("/")
    public ResponseEntity<List<SportDTO>> getAllSports() {
        List<SportDTO> sports = sportService.findAll().stream()
                .map(mapper::toDTO)
                .toList();
        return ResponseEntity.ok(sports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSportById(@PathVariable Long id) {
        try {
            Sport sport = sportService.findById(id);
            return ResponseEntity.ok(mapper.toDTO(sport));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> createSport(@RequestBody SportBasicInfoDTO dto) {
        try {
            Sport sport = mapper.toEntity(dto);
            Sport savedSport = sportService.save(sport);
            
            URI location = fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(savedSport.getId())
                    .toUri();
                    
            return ResponseEntity.created(location).body(mapper.toDTO(savedSport));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSport(@PathVariable Long id, @RequestBody SportBasicInfoDTO dto) {
        try {
            Sport updatedSport = sportService.update(id, mapper.toEntity(dto));
            return ResponseEntity.ok(mapper.toDTO(updatedSport));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSport(@PathVariable Long id) {
        sportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}


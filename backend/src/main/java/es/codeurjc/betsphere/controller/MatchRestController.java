package es.codeurjc.betsphere.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.codeurjc.betsphere.dto.MatchDTO;
import es.codeurjc.betsphere.dto.MatchMapper;
import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.service.MatchService;

import java.util.List;
import java.net.URI;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequest;



@RestController
@RequestMapping("/api/v1/matches")

public class MatchRestController {
    
    private final MatchService matchService;
    private final MatchMapper mapper;

    public MatchRestController(MatchService matchService, MatchMapper mapper){
        this.matchService = matchService;
        this.mapper = mapper;
    }

    @GetMapping({"", "/"})
    public List<MatchDTO> getMatches() {
        return mapper.toDTOs(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMatch(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(mapper.toDTO(matchService.getMatch(id)));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping({"", "/"})
    public ResponseEntity<?> createMatch(@RequestBody MatchDTO dto) {
        try {
            Match match = mapper.toEntity(dto);
            match = matchService.create(match);
            URI location = fromCurrentRequest().path("/{id}").buildAndExpand(match.getId()).toUri();
            return ResponseEntity.created(location).body(mapper.toDTO(match));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMatch(@PathVariable Long id, @RequestBody MatchDTO dto) {
        try {
            return ResponseEntity.ok(mapper.toDTO(matchService.update(id, mapper.toEntity(dto))));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMatch(@PathVariable Long id) {
        try {
            matchService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
    
    
}

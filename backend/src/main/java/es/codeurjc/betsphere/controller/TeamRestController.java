package es.codeurjc.betsphere.controller;

import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.codeurjc.betsphere.dto.TeamDTO;
import es.codeurjc.betsphere.dto.TeamBasicInfoDTO;
import es.codeurjc.betsphere.dto.TeamMapper;
import es.codeurjc.betsphere.model.Team;
import es.codeurjc.betsphere.service.TeamService;

@RestController 
@RequestMapping("/api/v1/teams")
public class TeamRestController {

    private final TeamService teamService;
    private final TeamMapper mapper;

    public TeamRestController(TeamService teamService, TeamMapper mapper) {
        this.teamService = teamService;
        this.mapper = mapper;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<Page<TeamDTO>> getAllTeams(Pageable pageable) {
        Page<TeamDTO> teams = teamService.findAll(pageable)
                .map(mapper::toDTO);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeamById(@PathVariable Long id) {
        try {
            Team team = teamService.findById(id);
            return ResponseEntity.ok(mapper.toDTO(team));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody TeamBasicInfoDTO dto) {
        try {
            Team updatedTeam = teamService.update(id, mapper.toEntity(dto));
            
            return ResponseEntity.ok(mapper.toDTO(updatedTeam));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        try {
            teamService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    
}
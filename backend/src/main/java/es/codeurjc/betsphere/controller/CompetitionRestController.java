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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequest;

import es.codeurjc.betsphere.dto.CompetitionBasicInfoDTO;
import es.codeurjc.betsphere.dto.CompetitionDTO;
import es.codeurjc.betsphere.dto.CompetitionMapper;
import es.codeurjc.betsphere.dto.TeamBasicInfoDTO;
import es.codeurjc.betsphere.dto.TeamMapper;
import es.codeurjc.betsphere.model.Competition;
import es.codeurjc.betsphere.model.Team;
import es.codeurjc.betsphere.service.CompetitionService;

@RestController
@RequestMapping("/api/v1/competitions")
public class CompetitionRestController {

    private final CompetitionService competitionService;
    private final CompetitionMapper mapper;
    private final TeamMapper teamMapper;

    public CompetitionRestController(CompetitionService competitionService, CompetitionMapper mapper,
            TeamMapper teamMapper) {
        this.competitionService = competitionService;
        this.mapper = mapper;
        this.teamMapper = teamMapper;
    }

    @GetMapping("/")
    public ResponseEntity<List<CompetitionDTO>> getAllCompetitions() {
        List<CompetitionDTO> competitions = competitionService.findAll().stream()
                .map(mapper::toDTO)
                .toList();
        return ResponseEntity.ok(competitions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompetitionById(@PathVariable Long id) {
        try {
            Competition competition = competitionService.findById(id);
            return ResponseEntity.ok(mapper.toDTO(competition));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> createCompetition(@RequestBody CompetitionBasicInfoDTO dto) {
        try {
            Competition competition = mapper.toEntity(dto);
            Competition savedCompetition = competitionService.save(competition, dto.sportId());

            URI location = fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(savedCompetition.getId())
                    .toUri();

            return ResponseEntity.created(location).body(mapper.toDTO(savedCompetition));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompetition(@PathVariable Long id, @RequestBody CompetitionBasicInfoDTO dto) {
        try {
            Competition updatedCompetition = competitionService.update(id, mapper.toEntity(dto), dto.sportId());
            return ResponseEntity.ok(mapper.toDTO(updatedCompetition));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompetition(@PathVariable Long id) {
        try {
            competitionService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/teams")
    public ResponseEntity<?> createTeamForCompetition(@PathVariable Long id, @RequestBody TeamBasicInfoDTO teamDTO) {
        try {
            Team savedTeam = competitionService.createAndLinkTeam(id,
                    new Team(teamDTO.name(), teamDTO.country(), teamDTO.logoUrl()));

            URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/v1/teams/{teamId}")
                    .buildAndExpand(savedTeam.getId())
                    .toUri();

            return ResponseEntity.created(location).body(teamMapper.toDTO(savedTeam));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{competitionId}/teams/{teamId}")
    public ResponseEntity<?> addExistingTeamToCompetition(@PathVariable Long competitionId, @PathVariable Long teamId) {
        try {
            Competition updatedCompetition = competitionService.linkExistingTeam(competitionId, teamId);
            return ResponseEntity.ok(mapper.toDTO(updatedCompetition));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{competitionId}/teams/{teamId}")
    public ResponseEntity<?> removeTeamFromCompetition(@PathVariable Long competitionId, @PathVariable Long teamId) {
        try {
            competitionService.unlinkTeam(competitionId, teamId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

}

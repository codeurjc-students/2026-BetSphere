package es.codeurjc.betsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.codeurjc.betsphere.model.Competition;
import es.codeurjc.betsphere.model.Sport;
import es.codeurjc.betsphere.model.Team;
import es.codeurjc.betsphere.repository.CompetitionRepository;
import es.codeurjc.betsphere.repository.TeamRepository;
import es.codeurjc.betsphere.repository.MatchRepository;

@Service 
public class CompetitionService {
    private final CompetitionRepository competitionRepository;
    private final SportService sportService; 
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;

    public CompetitionService(CompetitionRepository competitionRepository, SportService sportService, TeamRepository teamRepository, MatchRepository matchRepository) {
        this.competitionRepository = competitionRepository;
        this.sportService = sportService;
        this.teamRepository = teamRepository;
        this.matchRepository = matchRepository;
    }

    public List<Competition> findAll() {
        return competitionRepository.findAll();
    }

    public Competition findById(Long id) {
        return competitionRepository.findById(id).orElseThrow();
    }

    public Competition save(Competition competition, Long sportId) {
        validateName(competition.getName());
        
        Sport sport = sportService.findById(sportId);
        competition.setSport(sport);
        
        return competitionRepository.save(competition);
    }

    @Transactional
    public Competition update(Long id, Competition updatedData, Long sportId) {
        validateName(updatedData.getName());
        if (sportId == null) {
            throw new IllegalArgumentException("Sport ID is required.");
        }
        
        Competition existing = findById(id);
        
        existing.setName(updatedData.getName());
        existing.setCountry(updatedData.getCountry());

        if (!existing.getSport().getId().equals(sportId)) {
            Sport newSport = sportService.findById(sportId);
            existing.setSport(newSport);
        }
        
        return competitionRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Competition competition = findById(id);
        if (!competition.getMatches().isEmpty()) {
            throw new IllegalStateException("Cannot delete a competition that has matches.");
        }
        competitionRepository.delete(competition);
    }

    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Competition name cannot be empty.");
        }
        //TODO: more validations
    }

    @Transactional
    public Team createAndLinkTeam(Long competitionId, Team newTeam) {
        Competition competition = findById(competitionId);
        
        if (newTeam.getName() == null || newTeam.getName().isBlank()) {
            throw new IllegalArgumentException("Team name cannot be empty");
        }
        if (teamRepository.findByName(newTeam.getName()).isPresent()) {
            throw new IllegalArgumentException("A team with this name already exists.");
        }
        
        Team savedTeam = teamRepository.save(newTeam);
        competition.getTeams().add(savedTeam);
        competitionRepository.save(competition);
        
        return savedTeam;
    }

    @Transactional
    public Competition linkExistingTeam(Long competitionId, Long teamId) {
        Competition competition = findById(competitionId);
        Team team = teamRepository.findById(teamId).orElseThrow();

        if (competition.getTeams().stream().noneMatch(existing -> existing.getId().equals(teamId))) {
            competition.getTeams().add(team);
            return competitionRepository.save(competition);
        }
        throw new IllegalArgumentException("Team is already in this competition");
    }

    @Transactional
    public Competition unlinkTeam(Long competitionId, Long teamId) {
        Competition competition = findById(competitionId);
        Team team = teamRepository.findById(teamId).orElseThrow();
        if (matchRepository.countByCompetitionAndTeam(competitionId, teamId) > 0) {
            throw new IllegalStateException("Cannot remove a team that participates in matches of this competition.");
        }
        boolean removed = competition.getTeams().removeIf(existing -> existing.getId().equals(team.getId()));
        if (!removed) {
            throw new IllegalArgumentException("Team is not in this competition");
        }
        return competitionRepository.save(competition);
    }
}

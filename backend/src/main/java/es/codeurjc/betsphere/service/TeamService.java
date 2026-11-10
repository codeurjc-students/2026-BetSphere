package es.codeurjc.betsphere.service;

import java.util.ArrayList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.codeurjc.betsphere.model.Team;
import es.codeurjc.betsphere.model.Competition;
import es.codeurjc.betsphere.repository.TeamRepository;
import es.codeurjc.betsphere.repository.MatchRepository;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;

    public TeamService(TeamRepository teamRepository, MatchRepository matchRepository) {
        this.teamRepository = teamRepository;
        this.matchRepository = matchRepository;
    }

    public Page<Team> findAll(Pageable pageable) {
        return teamRepository.findAll(pageable);
    }

    public Team findById(Long id) {
        return teamRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Team not found."));
    }


    @Transactional
    public Team save(Team team) {
        validateName(team.getName());
        teamRepository.findByName(team.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(team.getId())) {
                throw new IllegalArgumentException("A team with this name already exists.");
            }
        });
        return teamRepository.save(team);
    }

    @Transactional
    public Team update(Long id, Team updatedData) {
        Team team = findById(id);
        team.setName(updatedData.getName());
        team.setCountry(updatedData.getCountry());
        team.setLogoUrl(updatedData.getLogoUrl());
        return save(team);
    }

    @Transactional
    public void delete(Long id) {
        Team team = findById(id);
        if (matchRepository.existsByHomeTeamRef_IdOrAwayTeamRef_Id(id, id)) {
            throw new IllegalStateException("Cannot delete a team that participates in matches.");
        }

        // Competition owns the join table. Remove every association in this
        // transaction before deleting the team to keep the operation atomic.
        for (Competition competition : new ArrayList<>(team.getCompetitions())) {
            competition.getTeams().removeIf(linkedTeam -> linkedTeam.getId().equals(id));
        }
        teamRepository.flush();
        teamRepository.delete(team);
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Team name cannot be empty.");
        }
    }
}

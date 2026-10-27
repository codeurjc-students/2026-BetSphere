package es.codeurjc.betsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.repository.MatchRepository;
import java.util.NoSuchElementException;
import es.codeurjc.betsphere.repository.TeamRepository;
import es.codeurjc.betsphere.repository.CompetitionRepository;
import es.codeurjc.betsphere.model.Team;
import es.codeurjc.betsphere.model.Competition;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MatchService {
    
    private final MatchRepository matchRepo;
    private final TeamRepository teamRepository;
    private final CompetitionRepository competitionRepository;

    public MatchService(MatchRepository matchRepo, TeamRepository teamRepository, CompetitionRepository competitionRepository){
        this.matchRepo = matchRepo;
        this.teamRepository = teamRepository;
        this.competitionRepository = competitionRepository;
    }

    public List<Match> getAllMatches(){
        return matchRepo.findAll();
    }

    public Match getMatch(Long id) {
        return matchRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Match not found"));
    }

    @Transactional
    public Match create(Match match) {
        match.setId(null);
        assignRelationships(match);
        validate(match);
        return matchRepo.save(match);
    }

    @Transactional
    public Match update(Long id, Match data) {
        Match match = getMatch(id);
        assignRelationships(data);
        match.setHomeTeamRef(data.getHomeTeamRef());
        match.setAwayTeamRef(data.getAwayTeamRef());
        match.setCompetition(data.getCompetition());
        match.setMatchDate(data.getMatchDate());
        match.setHomeOdds(data.getHomeOdds());
        match.setDrawOdds(data.getDrawOdds());
        match.setAwayOdds(data.getAwayOdds());
        match.setGameStatus(data.getGameStatus());
        validate(match);
        return matchRepo.save(match);
    }

    public void delete(Long id) {
        matchRepo.delete(getMatch(id));
    }

    private void validate(Match match) {
        if (match.getHomeTeamRef() == null || match.getAwayTeamRef() == null || match.getCompetition() == null) {
            throw new IllegalArgumentException("Home team, away team and competition are required.");
        }
        if (match.getHomeTeamRef().getId().equals(match.getAwayTeamRef().getId())) {
            throw new IllegalArgumentException("A team cannot play against itself.");
        }
        boolean homeIsInCompetition = match.getCompetition().getTeams().stream()
                .anyMatch(team -> team.getId().equals(match.getHomeTeamRef().getId()));
        boolean awayIsInCompetition = match.getCompetition().getTeams().stream()
                .anyMatch(team -> team.getId().equals(match.getAwayTeamRef().getId()));
        if (!homeIsInCompetition || !awayIsInCompetition) {
            throw new IllegalArgumentException("Both teams must belong to the match competition.");
        }
        if (match.getMatchDate() == null) {
            throw new IllegalArgumentException("Match date is required.");
        }
    }

    private void assignRelationships(Match match) {
        if (match.getHomeTeamRef() == null || match.getHomeTeamRef().getId() == null
                || match.getAwayTeamRef() == null || match.getAwayTeamRef().getId() == null
                || match.getCompetition() == null || match.getCompetition().getId() == null) {
            throw new IllegalArgumentException("Home team, away team and competition IDs are required.");
        }
        Team home = teamRepository.findById(match.getHomeTeamRef().getId()).orElseThrow(() -> new NoSuchElementException("Home team not found."));
        Team away = teamRepository.findById(match.getAwayTeamRef().getId()).orElseThrow(() -> new NoSuchElementException("Away team not found."));
        Competition competition = competitionRepository.findById(match.getCompetition().getId())
                .orElseThrow(() -> new NoSuchElementException("Competition not found."));
        match.setHomeTeamRef(home);
        match.setAwayTeamRef(away);
        match.setCompetition(competition);
    }

}

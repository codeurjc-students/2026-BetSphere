package es.codeurjc.betsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import es.codeurjc.betsphere.model.Competition;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;
import java.util.Optional;

public interface CompetitionRepository extends JpaRepository<Competition, Long>{

    @Override
    @EntityGraph(attributePaths = {"sport", "matches", "matches.homeTeamRef", "matches.awayTeamRef"})
    List<Competition> findAll();

    @Override
    @EntityGraph(attributePaths = {"sport", "matches", "matches.homeTeamRef", "matches.awayTeamRef", "teams"})
    Optional<Competition> findById(Long id);
    
}

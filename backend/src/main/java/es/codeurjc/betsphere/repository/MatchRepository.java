package es.codeurjc.betsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import es.codeurjc.betsphere.model.Match;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MatchRepository extends JpaRepository<Match, Long> {

    @Override
    @EntityGraph(attributePaths = {"homeTeamRef", "awayTeamRef", "competition"})
    java.util.List<Match> findAll();

    @Override
    @EntityGraph(attributePaths = {"homeTeamRef", "awayTeamRef", "competition"})
    Optional<Match> findById(Long id);

    boolean existsByHomeTeamRef_IdOrAwayTeamRef_Id(Long homeTeamId, Long awayTeamId);

    @Query("select count(m) from Match m where m.competition.id = :competitionId "
            + "and (m.homeTeamRef.id = :teamId or m.awayTeamRef.id = :teamId)")
    long countByCompetitionAndTeam(@Param("competitionId") Long competitionId, @Param("teamId") Long teamId);
    
}

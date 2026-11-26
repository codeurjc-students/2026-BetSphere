package es.codeurjc.betsphere.repository;

import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import es.codeurjc.betsphere.model.Match;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MatchRepository extends JpaRepository<Match, Long> {

    @EntityGraph(attributePaths = {"homeTeamRef", "awayTeamRef", "competition"})
    List<Match> findByCompetitionId(Long competitionId);

    @EntityGraph(attributePaths = {"homeTeamRef", "awayTeamRef", "competition"})
    @Query("""
            select m from Match m
            left join m.homeTeamRef home
            left join m.awayTeamRef away
            where (:query is null or locate(lower(:query), lower(concat(
                coalesce(home.name, m.homeTeam, ''), ' ', coalesce(away.name, m.awayTeam, '')
            ))) > 0)
            and (:status is null or m.gameStatus = :status)
            and (:fromDate is null or m.matchDate >= :fromDate)
            """)
    Page<Match> search(@Param("query") String query, @Param("status") String status,
            @Param("fromDate") LocalDateTime fromDate, Pageable pageable);

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

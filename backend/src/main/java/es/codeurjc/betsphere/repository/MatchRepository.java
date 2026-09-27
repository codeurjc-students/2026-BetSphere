package es.codeurjc.betsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import es.codeurjc.betsphere.model.Match;

public interface MatchRepository extends JpaRepository<Match, Long> {
    
}

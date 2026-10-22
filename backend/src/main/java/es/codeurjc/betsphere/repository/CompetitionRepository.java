package es.codeurjc.betsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import es.codeurjc.betsphere.model.Competition;

public interface CompetitionRepository extends JpaRepository<Competition, Long>{
    
}

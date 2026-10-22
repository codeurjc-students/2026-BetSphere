package es.codeurjc.betsphere.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import es.codeurjc.betsphere.model.Sport;

public interface SportRepository extends JpaRepository<Sport, Long>{
    
    Optional<Sport> findByName(String name);
    
}

package es.codeurjc.betsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import es.codeurjc.betsphere.model.Team;

public interface TeamRepository extends JpaRepository<Team, Long>{

     Optional<Team> findByName(String name);   
    
}

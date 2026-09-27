package es.codeurjc.betsphere.service;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.repository.MatchRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

// another alternative is to use @Component to mark it as an important file and CommandLineRunner to insert the data at the end

@Service
public class DatabaseInitializer {

    private final MatchRepository matchRepository;

    public DatabaseInitializer(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    @PostConstruct
    public void init() {
        if (matchRepository.count() == 0) {
            
            Match match1 = new Match("Real Madrid", "Barcelona", LocalDateTime.now().plusDays(2), 2.10, 3.40, 3.10, "SCHEDULED");
            Match match2 = new Match("Manchester City", "Arsenal", LocalDateTime.now().plusDays(3), 1.95, 3.60, 4.00, "SCHEDULED");
            Match match3 = new Match("Bayern Munich", "B. Dortmund", LocalDateTime.now().plusDays(4), 1.60, 4.20, 5.50, "SCHEDULED");
            matchRepository.saveAll(List.of(match1, match2, match3));
            
            System.out.println("Database initializated with dummy data.");
        } else {
            System.out.println("Database has already data. No data initialization required.");
        }
    }
}
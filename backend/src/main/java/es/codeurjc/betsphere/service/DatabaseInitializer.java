package es.codeurjc.betsphere.service;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.model.User;
import es.codeurjc.betsphere.repository.MatchRepository;
import es.codeurjc.betsphere.repository.UserRepository;

@Service
public class DatabaseInitializer {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(MatchRepository matchRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        // Matches
        if (matchRepository.count() == 0) {
            Match match1 = new Match("Real Madrid", "Barcelona", LocalDateTime.now().plusDays(2), 2.10, 3.40, 3.10,
                    "SCHEDULED");
            Match match2 = new Match("Manchester City", "Arsenal", LocalDateTime.now().plusDays(3), 1.95, 3.60, 4.00,
                    "SCHEDULED");
            Match match3 = new Match("Bayern Munich", "B. Dortmund", LocalDateTime.now().plusDays(4), 1.60, 4.20, 5.50,
                    "SCHEDULED");
            matchRepository.saveAll(List.of(match1, match2, match3));
            System.out.println("Matches initialized with dummy data.");
        }

        // Users
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@betsphere.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(List.of("ROLE_ADMIN", "ROLE_REGISTERED"));

            User user = new User();
            user.setUsername("user");
            user.setEmail("user@betsphere.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(List.of("ROLE_REGISTERED"));

            userRepository.saveAll(List.of(admin, user));
            System.out.println("Users initialized with dummy data.");
        }
    }
}
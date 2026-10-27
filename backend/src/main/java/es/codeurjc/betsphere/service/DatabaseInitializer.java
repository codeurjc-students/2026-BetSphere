package es.codeurjc.betsphere.service;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.model.User;
import es.codeurjc.betsphere.model.Team;
import es.codeurjc.betsphere.model.Sport;
import es.codeurjc.betsphere.model.Competition;
import es.codeurjc.betsphere.repository.TeamRepository;
import es.codeurjc.betsphere.repository.SportRepository;
import es.codeurjc.betsphere.repository.CompetitionRepository;
import es.codeurjc.betsphere.repository.MatchRepository;
import es.codeurjc.betsphere.repository.UserRepository;

@Service
@ConditionalOnProperty(name = "betsphere.seeder.enabled", havingValue = "true")
public class DatabaseInitializer {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TeamRepository teamRepository;
    private final SportRepository sportRepository;
    private final CompetitionRepository competitionRepository;

    public DatabaseInitializer(MatchRepository matchRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            TeamRepository teamRepository,
            SportRepository sportRepository,
            CompetitionRepository competitionRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.teamRepository = teamRepository;
        this.sportRepository = sportRepository;
        this.competitionRepository = competitionRepository;
    }

    @PostConstruct
    public void init() {
        // Matches
        if (matchRepository.count() == 0) {
            Sport football = sportRepository.save(new Sport("Football", null));
            Competition competition = competitionRepository.save(new Competition("Premier League", "England", football, null));
            Team realMadrid = teamRepository.save(new Team("Real Madrid", "Spain", null));
            Team barcelona = teamRepository.save(new Team("Barcelona", "Spain", null));
            Team manchesterCity = teamRepository.save(new Team("Manchester City", "England", null));
            Team arsenal = teamRepository.save(new Team("Arsenal", "England", null));
            Team bayern = teamRepository.save(new Team("Bayern Munich", "Germany", null));
            Team dortmund = teamRepository.save(new Team("B. Dortmund", "Germany", null));
            competition.getTeams().addAll(List.of(realMadrid, barcelona, manchesterCity, arsenal, bayern, dortmund));
            competitionRepository.save(competition);

            Match match1 = new Match("Real Madrid", "Barcelona", LocalDateTime.now().plusDays(2), 2.10, 3.40, 3.10,
                    "SCHEDULED");
            match1.setHomeTeamRef(realMadrid);
            match1.setAwayTeamRef(barcelona);
            match1.setCompetition(competition);
            Match match2 = new Match("Manchester City", "Arsenal", LocalDateTime.now().plusDays(3), 1.95, 3.60, 4.00,
                    "SCHEDULED");
            match2.setHomeTeamRef(manchesterCity);
            match2.setAwayTeamRef(arsenal);
            match2.setCompetition(competition);
            Match match3 = new Match("Bayern Munich", "B. Dortmund", LocalDateTime.now().plusDays(4), 1.60, 4.20, 5.50,
                    "SCHEDULED");
            match3.setHomeTeamRef(bayern);
            match3.setAwayTeamRef(dortmund);
            match3.setCompetition(competition);
            matchRepository.saveAll(List.of(match1, match2, match3));
            log.info("Matches initialized with dummy data.");
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
            log.info("Users initialized with dummy data.");
        }
    }
}

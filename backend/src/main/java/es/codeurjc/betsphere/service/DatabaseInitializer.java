package es.codeurjc.betsphere.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
public class DatabaseInitializer implements ApplicationRunner {

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

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // Seed sports independently so existing matches cannot prevent setup.
        Sport football = getOrCreateSport("Football");
        Sport basketball = getOrCreateSport("Basketball");
        Sport tennis = getOrCreateSport("Tennis");

        Competition premierLeague = getOrCreateCompetition("Premier League", "England", football);
        Competition laLiga = getOrCreateCompetition("La Liga", "Spain", football);
        Competition bundesliga = getOrCreateCompetition("Bundesliga", "Germany", football);
        Competition euroleague = getOrCreateCompetition("EuroLeague", "Europe", basketball);
        Competition atpTour = getOrCreateCompetition("ATP Tour", "International", tennis);

        Team manCity = getOrCreateTeam("Manchester City", "England");
        Team arsenal = getOrCreateTeam("Arsenal", "England");
        Team liverpool = getOrCreateTeam("Liverpool", "England");
        Team realMadrid = getOrCreateTeam("Real Madrid", "Spain");
        Team barcelona = getOrCreateTeam("Barcelona", "Spain");
        Team atletico = getOrCreateTeam("Atletico Madrid", "Spain");
        Team bayern = getOrCreateTeam("Bayern Munich", "Germany");
        Team dortmund = getOrCreateTeam("Borussia Dortmund", "Germany");
        Team alba = getOrCreateTeam("ALBA Berlin", "Germany");
        Team olympiacos = getOrCreateTeam("Olympiacos", "Greece");
        Team nadal = getOrCreateTeam("Rafael Nadal", "Spain");
        Team alcaraz = getOrCreateTeam("Carlos Alcaraz", "Spain");

        addTeams(premierLeague, manCity, arsenal, liverpool);
        addTeams(laLiga, realMadrid, barcelona, atletico);
        addTeams(bundesliga, bayern, dortmund);
        addTeams(euroleague, alba, olympiacos);
        addTeams(atpTour, nadal, alcaraz);

        // Add missing example matches without duplicating them on every startup.
        createMatchIfMissing("Manchester City", "Arsenal", LocalDateTime.now().plusDays(2), 1.95, 3.60, 4.00,
                "SCHEDULED", manCity, arsenal, premierLeague);
        createMatchIfMissing("Liverpool", "Manchester City", LocalDateTime.now().plusDays(4), 2.45, 3.50, 2.70,
                "SCHEDULED", liverpool, manCity, premierLeague);
        createMatchIfMissing("Real Madrid", "Barcelona", LocalDateTime.now().plusDays(3), 2.10, 3.40, 3.10,
                "SCHEDULED", realMadrid, barcelona, laLiga);
        createMatchIfMissing("Atletico Madrid", "Real Madrid", LocalDateTime.now().plusDays(6), 2.80, 3.20, 2.45,
                "SCHEDULED", atletico, realMadrid, laLiga);
        createMatchIfMissing("Bayern Munich", "Borussia Dortmund", LocalDateTime.now().plusDays(5), 1.60, 4.20, 5.50,
                "SCHEDULED", bayern, dortmund, bundesliga);
        createMatchIfMissing("ALBA Berlin", "Olympiacos", LocalDateTime.now().plusDays(7), 2.60, 0.0, 1.50,
                "SCHEDULED", alba, olympiacos, euroleague);
        createMatchIfMissing("Rafael Nadal", "Carlos Alcaraz", LocalDateTime.now().plusDays(8), 3.20, 0.0, 1.30,
                "SCHEDULED", nadal, alcaraz, atpTour);

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

    private Sport getOrCreateSport(String name) {
        return sportRepository.findAll().stream()
                .filter(sport -> sport.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> sportRepository.save(new Sport(name, null)));
    }

    private Competition getOrCreateCompetition(String name, String country, Sport sport) {
        return competitionRepository.findAll().stream()
                .filter(competition -> competition.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> competitionRepository.save(new Competition(name, country, sport, null)));
    }

    private Team getOrCreateTeam(String name, String country) {
        return teamRepository.findAll().stream()
                .filter(team -> team.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> teamRepository.save(new Team(name, country, null)));
    }

    private void addTeams(Competition competition, Team... teams) {
        for (Team team : teams) {
            if (competition.getTeams().stream().noneMatch(existing -> existing.getId().equals(team.getId()))) {
                competition.getTeams().add(team);
            }
        }
        competitionRepository.save(competition);
    }

    private void createMatchIfMissing(String home, String away, LocalDateTime date,
            double homeOdds, double drawOdds, double awayOdds, String status,
            Team homeTeam, Team awayTeam, Competition competition) {
        boolean exists = matchRepository.findAll().stream().anyMatch(match ->
                match.getHomeTeam().equalsIgnoreCase(home)
                        && match.getAwayTeam().equalsIgnoreCase(away)
                        && match.getCompetition() != null
                        && match.getCompetition().getId().equals(competition.getId()));
        if (!exists) {
            Match match = new Match(home, away, date, homeOdds, drawOdds, awayOdds, status);
            match.setHomeTeamRef(homeTeam);
            match.setAwayTeamRef(awayTeam);
            match.setCompetition(competition);
            matchRepository.save(match);
        }
    }
}

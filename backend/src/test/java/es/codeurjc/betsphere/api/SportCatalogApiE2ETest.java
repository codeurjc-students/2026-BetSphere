package es.codeurjc.betsphere.api;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;

import es.codeurjc.betsphere.model.Competition;
import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.model.Sport;
import es.codeurjc.betsphere.repository.CompetitionRepository;
import es.codeurjc.betsphere.service.CompetitionService;
import es.codeurjc.betsphere.repository.SportRepository;
import es.codeurjc.betsphere.service.SportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Testcontainers
class SportCatalogApiE2ETest {

    @Container
    @ServiceConnection
    static final MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0");

    @Autowired
    private CompetitionRepository competitions;

    @Autowired
    private CompetitionService competitionService;

    @Autowired
    private es.codeurjc.betsphere.service.MatchService matchService;

    @Autowired
    private es.codeurjc.betsphere.repository.TeamRepository teams;

    @Autowired
    private es.codeurjc.betsphere.service.TeamService teamService;

    @LocalServerPort
    private int port;

    @Autowired
    private SportRepository sports;

    @Autowired
    private SportService sportService;

    @Test
    void anonymousVisitorCanListSports() {
        given().port(port).queryParam("page", 0).queryParam("size", 10)
                .get("/api/v1/sports/")
                .then().statusCode(200).body("content.name", hasItem("Football"));
    }

    @Test
    void sportServiceReadsNewlyPersistedSport() {
        var saved = sports.save(new Sport("Volleyball", null));

        assertThat(sportService.findAll(Pageable.unpaged()).getContent())
                .extracting(Sport::getId).contains(saved.getId());
    }

    @Test
    void sportDetailListsOnlyItsCompetitions() {
        var football = sports.findByName("Football").orElseThrow();

        given().port(port).pathParam("id", football.getId())
                .get("/api/v1/sports/{id}")
                .then().statusCode(200)
                .body("competitions.name", org.hamcrest.Matchers.containsInAnyOrder("Premier League", "La Liga", "Bundesliga"));
    }

    @Test
    @org.springframework.transaction.annotation.Transactional
    void sportServiceLoadsCompetitionRelationshipsFromMysql() {
        var football = sports.findByName("Football").orElseThrow();

        assertThat(sportService.findById(football.getId()).getCompetitions())
                .extracting(es.codeurjc.betsphere.model.Competition::getName)
                .containsExactlyInAnyOrder("Premier League", "La Liga", "Bundesliga");
    }

    @Test
    void competitionEndpointReturnsOnlyItsMatches() {
        given().port(port).pathParam("id", laLigaId())
                .get("/api/v1/competitions/{id}")
                .then().statusCode(200)
                .body("name", org.hamcrest.Matchers.equalTo("La Liga"))
                .body("matches.homeTeam", org.hamcrest.Matchers.containsInAnyOrder("Real Madrid", "Atletico Madrid"));
    }

    @Test
    @org.springframework.transaction.annotation.Transactional
    void competitionServiceLoadsItsScheduleFromMysql() {
        assertThat(competitionService.findById(laLigaId()).getMatches())
                .extracting(Match::getHomeTeam)
                .containsExactlyInAnyOrder("Real Madrid", "Atletico Madrid");
    }

    private Long laLigaId() {
        return competitions.findAll().stream().filter(competition -> "La Liga".equals(competition.getName()))
                .map(Competition::getId).findFirst().orElseThrow();
    }

    @Test
    @org.springframework.transaction.annotation.Transactional
    void matchDetailEndpointReturnsTeamsCompetitionAndOdds() {
        given().port(port).pathParam("id", madridBarcelonaId())
                .get("/api/v1/matches/{id}")
                .then().statusCode(200)
                .body("homeTeam.name", org.hamcrest.Matchers.equalTo("Real Madrid"))
                .body("awayTeam.name", org.hamcrest.Matchers.equalTo("Barcelona"))
                .body("competition.name", org.hamcrest.Matchers.equalTo("La Liga"))
                .body("homeOdds", org.hamcrest.Matchers.equalTo(2.1f));
    }

    @Test
    @org.springframework.transaction.annotation.Transactional
    void matchServiceLoadsItsTeamsAndOddsFromMysql() {
        var match = matchService.getMatch(madridBarcelonaId());

        assertThat(match.getHomeTeamRef().getName()).isEqualTo("Real Madrid");
        assertThat(match.getAwayTeamRef().getName()).isEqualTo("Barcelona");
        assertThat(match.getHomeOdds()).isEqualTo(2.10);
    }

    private Long madridBarcelonaId() {
        return competitionService.findById(laLigaId()).getMatches().stream()
                .filter(match -> "Barcelona".equals(match.getAwayTeam()))
                .map(Match::getId).findFirst().orElseThrow();
    }

    @Test
    void teamEndpointReturnsProfileAndSeasonStatistics() {
        var team = teams.findByName("Real Madrid").orElseThrow();

        given().port(port).pathParam("id", team.getId())
                .get("/api/v1/teams/{id}")
                .then().statusCode(200)
                .body("name", org.hamcrest.Matchers.equalTo("Real Madrid"))
                .body("country", org.hamcrest.Matchers.equalTo("Spain"))
                .body("totalMatches", org.hamcrest.Matchers.equalTo(team.getTotalMatches()));
    }

    @Test
    void teamServiceReadsPersistedProfileFromMysql() {
        var saved = teams.save(new es.codeurjc.betsphere.model.Team("Valencia QA", "Spain", null));

        var profile = teamService.findById(saved.getId());

        assertThat(profile.getName()).isEqualTo("Valencia QA");
        assertThat(profile.getCountry()).isEqualTo("Spain");
    }

    @Test
    void sportServicePersistsChangesAndDeletesFromMysql() {
        var saved = sportService.save(new Sport("Database sport QA", null));
        try {
            assertThat(sports.findById(saved.getId())).isPresent();
            sportService.update(saved.getId(), new Sport("Updated database sport QA", null));
            assertThat(sports.findById(saved.getId()).orElseThrow().getName())
                    .isEqualTo("Updated database sport QA");
        } finally {
            sportService.delete(saved.getId());
        }
        assertThat(sports.existsById(saved.getId())).isFalse();
    }

    @Test
    void competitionServicePersistsSportAndCountryChangesInMysql() {
        var football = sports.findByName("Football").orElseThrow();
        var basketball = sports.findByName("Basketball").orElseThrow();
        var saved = competitionService.save(new Competition("Database League QA", "Spain", null, null),
                football.getId());
        try {
            assertThat(competitions.findById(saved.getId()).orElseThrow().getSport().getId())
                    .isEqualTo(football.getId());
            competitionService.update(saved.getId(),
                    new Competition("Updated Database League QA", "France", null, null), basketball.getId());

            var updated = competitions.findById(saved.getId()).orElseThrow();
            assertThat(updated.getName()).isEqualTo("Updated Database League QA");
            assertThat(updated.getCountry()).isEqualTo("France");
            assertThat(updated.getSport().getId()).isEqualTo(basketball.getId());
        } finally {
            competitionService.delete(saved.getId());
        }
        assertThat(competitions.existsById(saved.getId())).isFalse();
    }

}

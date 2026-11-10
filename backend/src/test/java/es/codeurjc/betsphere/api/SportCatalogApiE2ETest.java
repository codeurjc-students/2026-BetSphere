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
}

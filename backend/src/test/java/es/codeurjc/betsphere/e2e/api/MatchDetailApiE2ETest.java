package es.codeurjc.betsphere.e2e.api;

import static io.restassured.RestAssured.given;
import es.codeurjc.betsphere.model.Competition;
import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.repository.CompetitionRepository;
import es.codeurjc.betsphere.service.CompetitionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import org.springframework.context.annotation.Import;
import es.codeurjc.betsphere.support.MysqlTestConfiguration;
import jakarta.transaction.Transactional;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Import(MysqlTestConfiguration.class)
class MatchDetailApiE2ETest {

    @LocalServerPort
    private int port;

    @Autowired
    private CompetitionRepository competitions;

    @Autowired
    private CompetitionService competitionService;

    @Test
    @Transactional
    void matchDetailEndpointReturnsTeamsCompetitionAndOdds() {
        given().port(port).pathParam("id", madridBarcelonaId())
                .get("/api/v1/matches/{id}")
                .then().statusCode(200)
                .body("homeTeam.name", org.hamcrest.Matchers.equalTo("Real Madrid"))
                .body("awayTeam.name", org.hamcrest.Matchers.equalTo("Barcelona"))
                .body("competition.name", org.hamcrest.Matchers.equalTo("La Liga"))
                .body("homeOdds", org.hamcrest.Matchers.equalTo(2.1f));
    }

    private Long laLigaId() {
        return competitions.findAll().stream().filter(competition -> "La Liga".equals(competition.getName()))
                .map(Competition::getId).findFirst().orElseThrow();
    }

    private Long madridBarcelonaId() {
        return competitionService.findById(laLigaId()).getMatches().stream()
                .filter(match -> "Barcelona".equals(match.getAwayTeam()))
                .map(Match::getId).findFirst().orElseThrow();
    }
}

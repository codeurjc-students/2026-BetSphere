package es.codeurjc.betsphere.e2e.api;

import static io.restassured.RestAssured.given;
import es.codeurjc.betsphere.model.Competition;
import es.codeurjc.betsphere.repository.CompetitionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import org.springframework.context.annotation.Import;
import es.codeurjc.betsphere.support.MysqlTestConfiguration;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Import(MysqlTestConfiguration.class)
class CompetitionApiE2ETest {

    @LocalServerPort
    private int port;

    @Autowired
    private CompetitionRepository competitions;

    @Test
    void competitionEndpointReturnsOnlyItsMatches() {
        given().port(port).pathParam("id", laLigaId())
                .get("/api/v1/competitions/{id}")
                .then().statusCode(200)
                .body("name", org.hamcrest.Matchers.equalTo("La Liga"))
                .body("matches.homeTeam", org.hamcrest.Matchers.containsInAnyOrder("Real Madrid", "Atletico Madrid"));
    }

    private Long laLigaId() {
        return competitions.findAll().stream().filter(competition -> "La Liga".equals(competition.getName()))
                .map(Competition::getId).findFirst().orElseThrow();
    }
}

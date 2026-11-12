package es.codeurjc.betsphere.e2e.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.hasItem;
import es.codeurjc.betsphere.repository.SportRepository;
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
class SportApiE2ETest {

    @LocalServerPort
    private int port;

    @Autowired
    private SportRepository sports;

    @Test
    void anonymousVisitorCanListSports() {
        given().port(port).queryParam("page", 0).queryParam("size", 10)
                .get("/api/v1/sports/")
                .then().statusCode(200).body("content.name", hasItem("Football"));
    }

    @Test
    void sportDetailListsOnlyItsCompetitions() {
        var football = sports.findByName("Football").orElseThrow();

        given().port(port).pathParam("id", football.getId())
                .get("/api/v1/sports/{id}")
                .then().statusCode(200)
                .body("competitions.name", org.hamcrest.Matchers.containsInAnyOrder("Premier League", "La Liga", "Bundesliga"));
    }
}

package es.codeurjc.betsphere.e2e.api;

import static io.restassured.RestAssured.given;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import static org.hamcrest.Matchers.equalTo;
import org.springframework.context.annotation.Import;

import es.codeurjc.betsphere.repository.TeamRepository;
import es.codeurjc.betsphere.support.MysqlTestConfiguration;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Import(MysqlTestConfiguration.class)
class TeamApiE2ETest {

    @LocalServerPort
    private int port;

    @Autowired
    private TeamRepository teams;

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
}

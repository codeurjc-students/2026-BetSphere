package es.codeurjc.betsphere.e2e.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.hasItem;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import static org.hamcrest.Matchers.equalTo;
import es.codeurjc.betsphere.security.jwt.LoginRequest;
import io.restassured.http.ContentType;
import org.springframework.context.annotation.Import;
import es.codeurjc.betsphere.support.MysqlTestConfiguration;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Import(MysqlTestConfiguration.class)
class AdminOperationsApiE2ETest {

    private static final String EMAIL = "user@betsphere.com";
    private static final String PASSWORD = "user123";

    @LocalServerPort
    private int port;

    @Test
    void userListRequiresAdministratorRole() {
        given().port(port).auth().oauth2(tokenFor(EMAIL, PASSWORD))
                .get("/api/v1/users/").then().statusCode(403);

        given().port(port).auth().oauth2(tokenFor("admin@betsphere.com", "admin123"))
                .get("/api/v1/users/").then().statusCode(200)
                .body("content.email", org.hamcrest.Matchers.hasItems(EMAIL, "admin@betsphere.com"));
    }

    @Test
    void onlyAdministratorCanManageSportsThroughHttp() {
        var payload = Map.of("name", "REST sport QA");
        given().port(port).auth().oauth2(tokenFor(EMAIL, PASSWORD)).contentType(ContentType.JSON)
                .body(payload).post("/api/v1/sports/").then().statusCode(403);

        String token = tokenFor("admin@betsphere.com", "admin123");
        int id = given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(payload).post("/api/v1/sports/").then().statusCode(201)
                .body("name", equalTo("REST sport QA")).extract().path("id");

        given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("name", "Updated REST sport QA"))
                .put("/api/v1/sports/{id}", id).then().statusCode(200)
                .body("name", equalTo("Updated REST sport QA"));
        given().port(port).auth().oauth2(token)
                .delete("/api/v1/sports/{id}", id).then().statusCode(204);
        given().port(port).get("/api/v1/sports/{id}", id).then().statusCode(404);
    }

    @Test
    void administratorManagesCompetitionsThroughHttp() {
        int sportId = given().port(port).get("/api/v1/sports/")
                .then().statusCode(200).extract().path("content.find { it.name == 'Football' }.id");
        String endpoint = "/api/v1/competitions/";
        var payload = Map.of("name", "REST League QA", "country", "Spain", "sportId", sportId);
        given().port(port).auth().oauth2(tokenFor(EMAIL, PASSWORD)).contentType(ContentType.JSON)
                .body(payload).post(endpoint).then().statusCode(403);

        String token = tokenFor("admin@betsphere.com", "admin123");
        int id = given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(payload).post(endpoint).then().statusCode(201)
                .body("sport.id", equalTo(sportId)).extract().path("id");

        given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("name", "Updated REST League QA", "country", "France", "sportId", sportId))
                .put(endpoint + id).then().statusCode(200).body("country", equalTo("France"));
        given().port(port).auth().oauth2(token).delete(endpoint + id).then().statusCode(204);
        given().port(port).get(endpoint + id).then().statusCode(404);
    }

    @Test
    void administratorManagesTeamsThroughHttp() {
        int competitionId = given().port(port).get("/api/v1/competitions/")
                .then().statusCode(200).extract().path("content.find { it.name == 'La Liga' }.id");
        String createEndpoint = "/api/v1/competitions/" + competitionId + "/teams";
        var payload = Map.of("name", "REST Team QA", "country", "Spain");
        given().port(port).auth().oauth2(tokenFor(EMAIL, PASSWORD)).contentType(ContentType.JSON)
                .body(payload).post(createEndpoint).then().statusCode(403);

        String token = tokenFor("admin@betsphere.com", "admin123");
        int id = given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(payload).post(createEndpoint).then().statusCode(201).extract().path("id");
        given().port(port).get("/api/v1/competitions/{id}", competitionId).then().statusCode(200)
                .body("teams.id", org.hamcrest.Matchers.hasItem(id));

        given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("name", "Updated REST Team QA", "country", "France"))
                .put("/api/v1/teams/{id}", id).then().statusCode(200).body("country", equalTo("France"));
        given().port(port).auth().oauth2(token).delete("/api/v1/teams/{id}", id).then().statusCode(204);
        given().port(port).get("/api/v1/teams/{id}", id).then().statusCode(404);
    }

    @Test
    void administratorManagesMatchesThroughHttp() {
        var competition = given().port(port).get("/api/v1/competitions/")
                .then().statusCode(200).extract()
                .<Map<String, Object>>path("content.find { it.name == 'La Liga' }");
        int competitionId = ((Number) competition.get("id")).intValue();
        var teams = (List<?>) competition.get("teams");
        int homeId = ((Number) ((Map<?, ?>) teams.get(0)).get("id")).intValue();
        int awayId = ((Number) ((Map<?, ?>) teams.get(1)).get("id")).intValue();
        var payload = new HashMap<String, Object>(Map.of(
                "homeTeamId", homeId, "awayTeamId", awayId, "competitionId", competitionId,
                "matchDate", "2030-06-01T18:00:00", "gameStatus", "SCHEDULED"));

        given().port(port).auth().oauth2(tokenFor(EMAIL, PASSWORD)).contentType(ContentType.JSON)
                .body(payload).post("/api/v1/matches/").then().statusCode(403);

        String token = tokenFor("admin@betsphere.com", "admin123");
        int id = given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(payload).post("/api/v1/matches/").then().statusCode(201)
                .body("competitionId", equalTo(competitionId)).extract().path("id");
        payload.put("gameStatus", "FINISHED");
        given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(payload).put("/api/v1/matches/{id}", id).then().statusCode(200)
                .body("gameStatus", equalTo("FINISHED"));
        given().port(port).auth().oauth2(token).delete("/api/v1/matches/{id}", id).then().statusCode(204);
        given().port(port).get("/api/v1/matches/{id}", id).then().statusCode(404);
    }

    private String tokenFor(String email, String password) {
        return given().port(port).contentType(ContentType.JSON)
                .body(new LoginRequest(email, password)).post("/api/v1/auth/login")
                .then().statusCode(200).extract().path("accessToken");
    }
}

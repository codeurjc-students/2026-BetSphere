package es.codeurjc.betsphere.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.blankOrNullString;

import java.net.HttpCookie;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.codeurjc.betsphere.repository.UserRepository;
import es.codeurjc.betsphere.security.jwt.JwtTokenProvider;
import es.codeurjc.betsphere.security.jwt.LoginRequest;
import es.codeurjc.betsphere.security.jwt.UserLoginService;
import es.codeurjc.betsphere.security.jwt.TokenType;
import io.restassured.http.ContentType;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Testcontainers
class LoginApiE2ETest {

    private static final String EMAIL = "user@betsphere.com";
    private static final String PASSWORD = "user123";

    @Container
    @ServiceConnection
    static final MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0");

    @LocalServerPort
    private int port;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Container
    static final org.testcontainers.containers.GenericContainer<?> minio =
            es.codeurjc.betsphere.MinioTestStorage.container();

    @org.springframework.test.context.DynamicPropertySource
    static void storageProperties(org.springframework.test.context.DynamicPropertyRegistry registry) {
        es.codeurjc.betsphere.MinioTestStorage.configure(registry, minio);
    }

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserLoginService loginService;

    @Autowired
    private es.codeurjc.betsphere.service.UserService users;

    @Test
    void loginIssuesTokenAcceptedByAuthenticatedEndpoint() {
        String token = given()
                .port(port)
                .contentType(ContentType.JSON)
                .body(new LoginRequest(EMAIL, PASSWORD))
                .post("/api/v1/auth/login")
                .then()
                .statusCode(200)
                .body("status", equalTo("SUCCESS"))
                .body("accessToken", not(blankOrNullString()))
                .cookie(TokenType.REFRESH_COOKIE_NAME, not(blankOrNullString()))
                .extract().path("accessToken");

        given().port(port).auth().oauth2(token)
                .get("/api/v1/users/me")
                .then().statusCode(200).body("email", equalTo(EMAIL));
    }

    @Test
    void loginRejectsIncorrectPassword() {
        given().port(port).contentType(ContentType.JSON)
                .body(new LoginRequest(EMAIL, "incorrect"))
                .post("/api/v1/auth/login")
                .then().statusCode(401).body("status", equalTo("FAILURE"));
    }

    @Test
    void authenticationManagerVerifiesPasswordAgainstMysql() {
        var authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(EMAIL, PASSWORD));

        assertThat(authentication.isAuthenticated()).isTrue();
        assertThat(authentication.getName()).isEqualTo(EMAIL);
    }

    @Test
    void refreshCookieRestoresSessionOverHttp() {
        String cookie = given().port(port).contentType(ContentType.JSON)
                .body(new LoginRequest(EMAIL, PASSWORD))
                .post("/api/v1/auth/login")
                .then().statusCode(200).extract().cookie(TokenType.REFRESH_COOKIE_NAME);

        String token = given().port(port).cookie(TokenType.REFRESH_COOKIE_NAME, cookie)
                .post("/api/v1/auth/refresh")
                .then().statusCode(200).body("status", equalTo("SUCCESS"))
                .extract().path("accessToken");

        given().port(port).auth().oauth2(token).get("/api/v1/users/me")
                .then().statusCode(200).body("email", equalTo(EMAIL));

        given().port(port).cookie(TokenType.REFRESH_COOKIE_NAME, "invalid")
                .post("/api/v1/auth/refresh")
                .then().statusCode(401).body("status", equalTo("FAILURE"));
    }

    @Test
    void refreshResolvesPersistedUser() {
        var persistedUser = userRepository.findByEmail(EMAIL).orElseThrow();
        String refreshToken = tokenProvider.generateRefreshToken(persistedUser);

        var result = loginService.refresh(null, null, refreshToken);

        assertThat(result.getStatusCode().value()).isEqualTo(200);
        assertThat(tokenProvider.validateToken(result.getBody().getAccessToken()).getSubject())
                .isEqualTo(EMAIL);
    }

    @Test
    void logoutExpiresRefreshCookieAndCookieLessSessionCannotRefresh() {
        String refreshCookie = given().port(port).contentType(ContentType.JSON)
                .body(new LoginRequest(EMAIL, PASSWORD))
                .post("/api/v1/auth/login")
                .then().statusCode(200).extract().cookie(TokenType.REFRESH_COOKIE_NAME);

        String setCookie = given().port(port).cookie(TokenType.REFRESH_COOKIE_NAME, refreshCookie)
                .post("/api/v1/auth/logout")
                .then().statusCode(200).body("status", equalTo("SUCCESS"))
                .extract().header("Set-Cookie");

        var expiredCookie = HttpCookie.parse(setCookie).getFirst();
        assertThat(expiredCookie.getName()).isEqualTo(TokenType.REFRESH_COOKIE_NAME);
        assertThat(expiredCookie.getValue()).isEmpty();
        assertThat(expiredCookie.getPath()).isEqualTo("/");
        assertThat(expiredCookie.hasExpired()).isTrue();
        given().port(port).post("/api/v1/auth/refresh").then().statusCode(400);
    }

    @Test
    void userListRequiresAdministratorRole() {
        given().port(port).auth().oauth2(tokenFor(EMAIL, PASSWORD))
                .get("/api/v1/users/").then().statusCode(403);

        given().port(port).auth().oauth2(tokenFor("admin@betsphere.com", "admin123"))
                .get("/api/v1/users/").then().statusCode(200)
                .body("content.email", org.hamcrest.Matchers.hasItems(EMAIL, "admin@betsphere.com"));
    }

    @Test
    void pagedUserServiceLoadsSeededAccountsFromMysql() {
        var page = users.getAllUsers(org.springframework.data.domain.PageRequest.of(0, 10));
        assertThat(page.getContent()).extracting(es.codeurjc.betsphere.model.User::getEmail)
                .contains(EMAIL, "admin@betsphere.com");
    }

    private String tokenFor(String email, String password) {
        return given().port(port).contentType(ContentType.JSON)
                .body(new LoginRequest(email, password)).post("/api/v1/auth/login")
                .then().statusCode(200).extract().path("accessToken");
    }

    @Test
    void onlyAdministratorCanManageSportsThroughHttp() {
        var payload = java.util.Map.of("name", "REST sport QA");
        given().port(port).auth().oauth2(tokenFor(EMAIL, PASSWORD)).contentType(ContentType.JSON)
                .body(payload).post("/api/v1/sports/").then().statusCode(403);

        String token = tokenFor("admin@betsphere.com", "admin123");
        int id = given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(payload).post("/api/v1/sports/").then().statusCode(201)
                .body("name", equalTo("REST sport QA")).extract().path("id");

        given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(java.util.Map.of("name", "Updated REST sport QA"))
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
        var payload = java.util.Map.of("name", "REST League QA", "country", "Spain", "sportId", sportId);
        given().port(port).auth().oauth2(tokenFor(EMAIL, PASSWORD)).contentType(ContentType.JSON)
                .body(payload).post(endpoint).then().statusCode(403);

        String token = tokenFor("admin@betsphere.com", "admin123");
        int id = given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(payload).post(endpoint).then().statusCode(201)
                .body("sport.id", equalTo(sportId)).extract().path("id");

        given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(java.util.Map.of("name", "Updated REST League QA", "country", "France", "sportId", sportId))
                .put(endpoint + id).then().statusCode(200).body("country", equalTo("France"));
        given().port(port).auth().oauth2(token).delete(endpoint + id).then().statusCode(204);
        given().port(port).get(endpoint + id).then().statusCode(404);
    }

    @Test
    void administratorManagesTeamsThroughHttp() {
        int competitionId = given().port(port).get("/api/v1/competitions/")
                .then().statusCode(200).extract().path("content.find { it.name == 'La Liga' }.id");
        String createEndpoint = "/api/v1/competitions/" + competitionId + "/teams";
        var payload = java.util.Map.of("name", "REST Team QA", "country", "Spain");
        given().port(port).auth().oauth2(tokenFor(EMAIL, PASSWORD)).contentType(ContentType.JSON)
                .body(payload).post(createEndpoint).then().statusCode(403);

        String token = tokenFor("admin@betsphere.com", "admin123");
        int id = given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(payload).post(createEndpoint).then().statusCode(201).extract().path("id");
        given().port(port).get("/api/v1/competitions/{id}", competitionId).then().statusCode(200)
                .body("teams.id", org.hamcrest.Matchers.hasItem(id));

        given().port(port).auth().oauth2(token).contentType(ContentType.JSON)
                .body(java.util.Map.of("name", "Updated REST Team QA", "country", "France"))
                .put("/api/v1/teams/{id}", id).then().statusCode(200).body("country", equalTo("France"));
        given().port(port).auth().oauth2(token).delete("/api/v1/teams/{id}", id).then().statusCode(204);
        given().port(port).get("/api/v1/teams/{id}", id).then().statusCode(404);
    }

    @Test
    void administratorManagesMatchesThroughHttp() {
        var competition = given().port(port).get("/api/v1/competitions/")
                .then().statusCode(200).extract()
                .<java.util.Map<String, Object>>path("content.find { it.name == 'La Liga' }");
        int competitionId = ((Number) competition.get("id")).intValue();
        var teams = (java.util.List<?>) competition.get("teams");
        int homeId = ((Number) ((java.util.Map<?, ?>) teams.get(0)).get("id")).intValue();
        int awayId = ((Number) ((java.util.Map<?, ?>) teams.get(1)).get("id")).intValue();
        var payload = new java.util.HashMap<String, Object>(java.util.Map.of(
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

    @Test
    void avatarUploadIsAuthenticatedAndPersistsInMysql() throws Exception {
        byte[] bytes = {1, 2, 3};
        String token = tokenFor(EMAIL, PASSWORD);

        given().port(port).multiPart("file", "avatar.png", bytes, "image/png")
                .post("/api/v1/images").then().statusCode(org.hamcrest.Matchers.isOneOf(401, 403));
        assertThat(userRepository.findByEmail(EMAIL).orElseThrow().getAvatarUrl()).isNull();

        String url = given().port(port).auth().oauth2(token).multiPart("file", "avatar.png", bytes, "image/png")
                .post("/api/v1/images").then().statusCode(201).extract().path("url");

        try {
            byte[] downloaded = given().port(port).get(url).then().statusCode(200)
                    .contentType("image/png").extract().asByteArray();
            assertThat(downloaded).containsExactly(bytes);
            assertThat(userRepository.findByEmail(EMAIL).orElseThrow().getAvatarUrl()).isEqualTo(url);
            given().port(port).auth().oauth2(token).get("/api/v1/users/me")
                    .then().statusCode(200).body("avatarUrl", equalTo(url));

            given().port(port).auth().oauth2(token).multiPart("file", "avatar.txt", bytes, "text/plain")
                    .post("/api/v1/images").then().statusCode(400);
            assertThat(userRepository.findByEmail(EMAIL).orElseThrow().getAvatarUrl()).isEqualTo(url);
        } finally {
            var user = userRepository.findByEmail(EMAIL).orElseThrow();
            user.setAvatarUrl(null);
            userRepository.save(user);
        }
    }
}

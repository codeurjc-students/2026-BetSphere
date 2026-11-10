package es.codeurjc.betsphere.api;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.blankOrNullString;

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

import es.codeurjc.betsphere.security.jwt.LoginRequest;
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
}

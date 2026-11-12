package es.codeurjc.betsphere.e2e.api;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.blankOrNullString;
import java.net.HttpCookie;
import es.codeurjc.betsphere.security.jwt.LoginRequest;
import es.codeurjc.betsphere.security.jwt.TokenType;
import io.restassured.http.ContentType;
import org.springframework.context.annotation.Import;
import es.codeurjc.betsphere.support.MysqlTestConfiguration;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Import(MysqlTestConfiguration.class)
class LoginApiE2ETest {

    private static final String EMAIL = "user@betsphere.com";
    private static final String PASSWORD = "user123";

    @LocalServerPort
    private int port;

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
}

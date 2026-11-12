package es.codeurjc.betsphere.e2e.api;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import static org.hamcrest.Matchers.equalTo;
import es.codeurjc.betsphere.repository.UserRepository;
import es.codeurjc.betsphere.security.jwt.LoginRequest;
import io.restassured.http.ContentType;
import es.codeurjc.betsphere.support.MinioTestStorage;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Testcontainers
class AvatarApiE2ETest {

    private static final String EMAIL = "user@betsphere.com";
    private static final String PASSWORD = "user123";

    @Container
    @ServiceConnection
    static final MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0");

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Container
    static final GenericContainer<?> minio =
            MinioTestStorage.container();

    @DynamicPropertySource
    static void storageProperties(DynamicPropertyRegistry registry) {
        MinioTestStorage.configure(registry, minio);
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

    private String tokenFor(String email, String password) {
        return given().port(port).contentType(ContentType.JSON)
                .body(new LoginRequest(email, password)).post("/api/v1/auth/login")
                .then().statusCode(200).extract().path("accessToken");
    }
}

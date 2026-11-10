package es.codeurjc.betsphere.api;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.codeurjc.betsphere.dto.UserRegisterDTO;
import es.codeurjc.betsphere.model.User;
import es.codeurjc.betsphere.repository.UserRepository;
import es.codeurjc.betsphere.service.UserService;
import io.restassured.http.ContentType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Testcontainers
class RegistrationApiE2ETest {

    @Container
    @ServiceConnection
    static final MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0");

    @LocalServerPort
    private int port;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository users;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void acceptsAdultAndRejectsMinorThroughHttp() {
        var adult = registration(18);
        var minor = registration(17);

        given().port(port).contentType(ContentType.JSON).body(adult)
                .post("/api/v1/users/")
                .then().statusCode(201).body("email", equalTo(adult.email()));

        given().port(port).contentType(ContentType.JSON).body(minor)
                .post("/api/v1/users/")
                .then().statusCode(422).body("error", equalTo("User must be 18 or older."));
    }

    @Test
    void persistsAdultWithEncodedPasswordInMysql() {
        var adult = registration(18);
        userService.register(new User(adult.username(), adult.email(), adult.password(),
                java.util.List.of(), adult.birthDate()));

        var saved = users.findByEmail(adult.email()).orElseThrow();
        assertThat(saved.getBirthDate()).isEqualTo(adult.birthDate());
        assertThat(saved.getPassword()).isNotEqualTo(adult.password());
        assertThat(passwordEncoder.matches(adult.password(), saved.getPassword())).isTrue();
    }

    private UserRegisterDTO registration(int age) {
        String username = "user_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        return new UserRegisterDTO(username, username + "@example.test", "ValidPass1!",
                LocalDate.now().minusYears(age));
    }
}

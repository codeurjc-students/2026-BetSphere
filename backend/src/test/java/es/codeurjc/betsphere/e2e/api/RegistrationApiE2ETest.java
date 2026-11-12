package es.codeurjc.betsphere.e2e.api;

import static io.restassured.RestAssured.given;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;
import static org.hamcrest.Matchers.equalTo;
import io.restassured.http.ContentType;
import java.time.LocalDate;
import java.util.UUID;
import es.codeurjc.betsphere.dto.UserRegisterDTO;
import org.springframework.context.annotation.Import;
import es.codeurjc.betsphere.support.MysqlTestConfiguration;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Import(MysqlTestConfiguration.class)
class RegistrationApiE2ETest {

    @LocalServerPort
    private int port;

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

    private UserRegisterDTO registration(int age) {
        String username = "user_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        return new UserRegisterDTO(username, username + "@example.test", "ValidPass1!",
                LocalDate.now().minusYears(age));
    }
}

package es.codeurjc.betsphere.e2e.api;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;

import es.codeurjc.betsphere.security.jwt.LoginRequest;
import es.codeurjc.betsphere.support.MinioTestStorage;
import io.restassured.http.ContentType;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
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

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Testcontainers
class AdminImageApiE2ETest {

    @Container
    @ServiceConnection
    static final MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0");

    @Container
    static final GenericContainer<?> storage = MinioTestStorage.container();

    @LocalServerPort
    private int port;

    @DynamicPropertySource
    static void storageProperties(DynamicPropertyRegistry registry) {
        MinioTestStorage.configure(registry, storage);
    }

    @ParameterizedTest
    @CsvSource({"sports, Football, iconUrl", "competitions, La Liga, iconUrl", "teams, Barcelona, logoUrl"})
    void onlyAdminsCanUploadAndTheCatalogServesTheImage(String resource, String name, String imageField) {
        String collection = "/api/v1/" + resource;
        int id = given().port(port).queryParam("size", 100).get(collection)
                .then().statusCode(200).extract().jsonPath().param("name", name)
                .getInt("content.find { it.name == name }.id");
        String entity = collection + "/" + id;
        String upload = entity + "/image";
        String admin = tokenFor("admin@betsphere.com", "admin123");
        String user = tokenFor("user@betsphere.com", "user123");
        byte[] bytes = {1, 2, 3};

        given().port(port).auth().oauth2(user).multiPart("file", "logo.png", bytes, "image/png")
                .post(upload).then().statusCode(403);

        String url = given().port(port).auth().oauth2(admin).multiPart("file", "logo.png", bytes, "image/png")
                .post(upload).then().statusCode(200).extract().path("url");
        assertThat(url).startsWith("/api/v1/images/");

        given().port(port).auth().oauth2(admin).multiPart("file", "logo.txt", bytes, "text/plain")
                .post(upload).then().statusCode(400);
        given().port(port).get(entity).then().statusCode(200).body(imageField, equalTo(url));
        byte[] downloaded = given().port(port).get(url).then().statusCode(200)
                .contentType("image/png").extract().asByteArray();
        assertThat(downloaded).containsExactly(bytes);
    }

    private String tokenFor(String email, String password) {
        return given().port(port).contentType(ContentType.JSON).body(new LoginRequest(email, password))
                .post("/api/v1/auth/login").then().statusCode(200).extract().path("accessToken");
    }
}

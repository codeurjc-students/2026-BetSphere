package es.codeurjc.betsphere.api;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;

import es.codeurjc.betsphere.model.Sport;
import es.codeurjc.betsphere.repository.SportRepository;
import es.codeurjc.betsphere.service.SportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"server.port=0", "server.ssl.enabled=false"})
@Testcontainers
class SportCatalogApiE2ETest {

    @Container
    @ServiceConnection
    static final MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0");

    @LocalServerPort
    private int port;

    @Autowired
    private SportRepository sports;

    @Autowired
    private SportService sportService;

    @Test
    void anonymousVisitorCanListSports() {
        given().port(port).queryParam("page", 0).queryParam("size", 10)
                .get("/api/v1/sports/")
                .then().statusCode(200).body("content.name", hasItem("Football"));
    }

    @Test
    void sportServiceReadsNewlyPersistedSport() {
        var saved = sports.save(new Sport("Volleyball", null));

        assertThat(sportService.findAll(Pageable.unpaged()).getContent())
                .extracting(Sport::getId).contains(saved.getId());
    }
}

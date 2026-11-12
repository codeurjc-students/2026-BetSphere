package es.codeurjc.betsphere.integration.database;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.repository.MatchRepository;
import es.codeurjc.betsphere.service.MatchService;

@SpringBootTest
@Testcontainers
class MatchIntegrationTest {

    @Container
    @ServiceConnection
    static MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("betsphere_test")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private MatchService matchService;

    @Test
    void shouldSaveAndRetrieveMatchFromRealDatabase() {
        matchRepository.deleteAll();

        Match newMatch = new Match("Liverpool", "Chelsea", LocalDateTime.now(), 2.00, 3.10, 3.50, "SCHEDULED");
        matchRepository.save(newMatch);

        List<Match> matches = matchService.getAllMatches();

        assertEquals(1, matches.size());
        assertEquals("Liverpool", matches.get(0).getHomeTeam());
        assertEquals("Chelsea", matches.get(0).getAwayTeam());
        assertTrue(mysqlContainer.isRunning());
    }

    @Test
    void readsSecondPageFromMysql() {
        matchRepository.deleteAll();
        matchRepository.save(new Match("Liverpool", "Chelsea", LocalDateTime.now(), 2.0, 3.0, 4.0, "SCHEDULED"));
        Match second = matchRepository.save(
                new Match("Arsenal", "Everton", LocalDateTime.now(), 2.0, 3.0, 4.0, "SCHEDULED"));
        var request = PageRequest.of(
                1, 1, Sort.by("id"));

        var page = matchService.getAllMatches(request);

        assertEquals(List.of(second.getId()), page.map(Match::getId).getContent());
        assertEquals(2, page.getTotalElements());
        assertTrue(page.isLast());
    }
}

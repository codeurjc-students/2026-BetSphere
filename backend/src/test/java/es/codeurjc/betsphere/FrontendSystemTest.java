package es.codeurjc.betsphere;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.repository.MatchRepository;
import io.github.bonigarcia.seljup.SeleniumJupiter;

import java.time.Duration;
import java.time.LocalDateTime;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@Testcontainers
@ExtendWith(SeleniumJupiter.class)
class FrontendSystemTest {

    @Container
    @ServiceConnection
    static final MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("betsphere_test")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private MatchRepository matchRepository;

    @BeforeEach
    void setUp() {
        matchRepository.deleteAll();
        Match realMadrid = new Match("Real Madrid", "Barcelona", LocalDateTime.now(), 2.10, 3.40, 3.20, "SCHEDULED");
        matchRepository.save(realMadrid);
    }

    @Test
    void mainPageShowsMatches(ChromeDriver driver) {
        driver.get("http://localhost:5173/");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "Real Madrid"));

        String bodyText = driver.findElement(By.tagName("body")).getText();
        assertThat(bodyText).contains("Real Madrid");
        assertThat(bodyText).contains("Barcelona");
    }
}
package es.codeurjc.betsphere;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.repository.MatchRepository;
import io.github.bonigarcia.seljup.SeleniumJupiter;

import java.time.Duration;
import java.time.LocalDateTime;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@TestPropertySource(properties = {
    "server.port=8443",
    "server.ssl.enabled=true",
    "server.ssl.key-store=classpath:keystore.jks",
    "server.ssl.key-store-password=password",
    "server.ssl.key-password=secret"
})
@Testcontainers
@ExtendWith(SeleniumJupiter.class)
class FrontendSystemTest {

    private static Process frontendProcess;

    @BeforeEach
    void startFrontend() throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder("npm", "run", "dev");
        processBuilder.directory(Path.of("../frontend").toFile());
        processBuilder.environment().put("API_PROXY_TARGET", "https://localhost:8443");
        processBuilder.redirectErrorStream(true);
        frontendProcess = processBuilder.start();
        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(60);
        while (System.nanoTime() < deadline && frontendProcess.isAlive()) {
            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress("localhost", 5173), 500);
                return;
            } catch (IOException notReadyYet) {
                Thread.sleep(250);
            }
        }
        throw new IllegalStateException("Vite did not start on port 5173");
    }

    @AfterEach
    void stopFrontend() throws InterruptedException {
        if (frontendProcess != null) {
            frontendProcess.destroy();
            if (!frontendProcess.waitFor(5, TimeUnit.SECONDS)) {
                frontendProcess.destroyForcibly();
            }
            frontendProcess = null;
        }
    }

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
    void mainPageShowsMatches(ChromeOptions options) {
        options.setAcceptInsecureCerts(true);
        options.addArguments("--ignore-certificate-errors");
        ChromeDriver driver = new ChromeDriver(options);
        try {
            driver.get("http://localhost:5173/");

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(60));
            wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("body"), "Real Madrid"));

            String bodyText = driver.findElement(By.tagName("body")).getText();
            assertThat(bodyText).contains("Real Madrid");
            assertThat(bodyText).contains("Barcelona");
        } finally {
            driver.quit();
        }
    }
}

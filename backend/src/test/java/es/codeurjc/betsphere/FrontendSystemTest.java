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
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.repository.MatchRepository;
import io.github.bonigarcia.seljup.SeleniumJupiter;

import java.time.Duration;
import java.time.LocalDateTime;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@TestPropertySource(properties = {
    "server.port=8080",
    "server.ssl.enabled=false"
})
@Testcontainers
@ExtendWith(SeleniumJupiter.class)
class FrontendSystemTest {

    private static final int FRONTEND_PORT = 5173;
    private static Process frontendProcess;
    private static final ByteArrayOutputStream frontendOutput = new ByteArrayOutputStream();

    @BeforeEach
    void startFrontend() throws IOException, InterruptedException {
        Path frontendDirectory = findFrontendDirectory();
        List<String> command = System.getProperty("os.name").toLowerCase().contains("win")
                ? List.of("cmd.exe", "/c", "npm", "run", "dev", "--", "--host", "127.0.0.1",
                        "--port", Integer.toString(FRONTEND_PORT), "--strictPort")
                : List.of("npm", "run", "dev", "--", "--host", "127.0.0.1",
                        "--port", Integer.toString(FRONTEND_PORT), "--strictPort");

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.directory(frontendDirectory.toFile());
        processBuilder.environment().put("API_PROXY_TARGET", "http://localhost:8080");
        processBuilder.redirectErrorStream(true);
        frontendOutput.reset();
        frontendProcess = processBuilder.start();

        Thread outputReader = new Thread(() -> {
            try {
                frontendProcess.getInputStream().transferTo(frontendOutput);
            } catch (IOException ignored) {
                // The stream closes when Vite exits.
            }
        });
        outputReader.setDaemon(true);
        outputReader.start();

        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(60);
        while (System.nanoTime() < deadline && frontendProcess.isAlive()) {
            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress("127.0.0.1", FRONTEND_PORT), 500);
                return;
            } catch (IOException notReadyYet) {
                Thread.sleep(250);
            }
        }

        stopFrontend();
        throw new IllegalStateException("Vite did not start on port " + FRONTEND_PORT + ". Output: "
                + frontendOutput.toString(StandardCharsets.UTF_8));
    }

    private Path findFrontendDirectory() {
        Path workingDirectory = Path.of("").toAbsolutePath().normalize();
        for (Path candidate : List.of(workingDirectory.resolve("frontend"),
                workingDirectory.getParent().resolve("frontend"))) {
            if (Files.isRegularFile(candidate.resolve("package.json"))) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not find the frontend directory from " + workingDirectory);
    }

    @AfterEach
    void stopFrontend() throws InterruptedException {
        if (frontendProcess != null) {
            frontendProcess.toHandle().descendants().forEach(ProcessHandle::destroyForcibly);
            frontendProcess.destroyForcibly();
            frontendProcess.waitFor(5, TimeUnit.SECONDS);
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
    void mainPageShowsMatches(ChromeDriver driver) {
        try {
            driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/matches");

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

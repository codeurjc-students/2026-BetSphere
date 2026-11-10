package es.codeurjc.betsphere;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.AfterEach;
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

    @Test
    void userCanSignInThroughLoginForm(ChromeDriver driver) {
        signInThroughForm(driver);
        assertThat(driver.getCurrentUrl()).endsWith(":" + FRONTEND_PORT + "/");
    }

    private void signInThroughForm(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/login");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")))
                .sendKeys("user@betsphere.com");
        driver.findElement(By.id("password")).sendKeys("user123");
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("a[aria-label='View profile of user@betsphere.com']")));

    }

    @Test
    void frontendAuthServiceSignsInAgainstRealApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/login");
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(30));

        Object result = driver.executeAsyncScript("""
                const done = arguments[arguments.length - 1];
                import('/app/services/auth-service.ts')
                    .then(async ({ login, getCurrentUser }) => {
                        const session = await login({
                            email: 'user@betsphere.com',
                            password: 'user123'
                        });
                        const user = await getCurrentUser(session.accessToken);
                        done({ status: session.status, email: user.email });
                    })
                    .catch(error => done({ error: error.message }));
                """);

        assertThat(result).isEqualTo(java.util.Map.of("status", "SUCCESS", "email", "user@betsphere.com"));
    }

    @Test
    void registrationFormRejectsMinorAndAcceptsAdult(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/register");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        String username = newRegistrationUsername();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username"))).sendKeys(username);
        driver.findElement(By.id("email")).sendKeys(username + "@example.test");
        driver.findElement(By.id("password")).sendKeys("ValidPass1!");
        setBirthDate(driver, "2015-06-15");
        driver.findElement(By.cssSelector("form button[type='submit']")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("#birthDate.is-invalid + .invalid-feedback")));
        assertThat(driver.findElement(By.cssSelector("#birthDate + .invalid-feedback")).getText())
                .contains("18 years old");

        setBirthDate(driver, "1990-06-15");
        driver.findElement(By.cssSelector("form button[type='submit']")).click();
        wait.until(ExpectedConditions.urlContains("/login?registered=1"));
    }

    @Test
    void frontendRegistrationServiceCreatesAccountThroughRealApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/register");
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(30));
        String username = newRegistrationUsername();

        Object email = driver.executeAsyncScript("""
                const [username, done] = arguments;
                import('/app/services/auth-service.ts')
                    .then(({ register }) => register({
                        username, email: username + '@example.test',
                        password: 'ValidPass1!', birthDate: '1990-06-15'
                    }))
                    .then(user => done(user.email))
                    .catch(error => done({ error: error.message }));
                """, username);
        assertThat(email).isEqualTo(username + "@example.test");
    }

    private String newRegistrationUsername() {
        return "user_" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    private void setBirthDate(ChromeDriver driver, String date) {
        driver.executeScript("arguments[0].value = arguments[1];",
                driver.findElement(By.id("birthDate")), date);
    }

    @Test
    void reloadRestoresSessionAndInvalidCookieRedirectsToLogin(ChromeDriver driver) {
        signInThroughForm(driver);
        driver.findElement(By.cssSelector("a[aria-label='View profile of user@betsphere.com']")).click();
        var wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        wait.until(ExpectedConditions.urlContains("/profile"));
        driver.navigate().refresh();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("a[aria-label='View profile of user@betsphere.com']")));
        assertThat(driver.getCurrentUrl()).endsWith("/profile");

        driver.manage().deleteCookieNamed("RefreshToken");
        driver.manage().addCookie(new org.openqa.selenium.Cookie("RefreshToken", "invalid"));
        driver.navigate().refresh();
        wait.until(ExpectedConditions.urlContains("/login?returnTo="));
    }

    @Test
    void frontendRefreshServiceRenewsSessionThroughRealApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/login");
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(30));
        Object email = driver.executeAsyncScript("""
                const done = arguments[0];
                import('/app/services/auth-service.ts')
                    .then(async ({ login, refreshAccessToken, getCurrentUser }) => {
                        await login({ email: 'user@betsphere.com', password: 'user123' });
                        const user = await getCurrentUser(await refreshAccessToken());
                        done(user.email);
                    })
                    .catch(error => done({ error: error.message }));
                """);

        assertThat(email).isEqualTo("user@betsphere.com");
    }
}

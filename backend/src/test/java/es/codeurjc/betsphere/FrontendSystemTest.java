package es.codeurjc.betsphere;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Keys;
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

    @BeforeAll
    static void startFrontend() throws IOException, InterruptedException {
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
        Process process = processBuilder.start();
        frontendProcess = process;

        Thread outputReader = new Thread(() -> {
            try {
                process.getInputStream().transferTo(frontendOutput);
            } catch (IOException ignored) {
                // The stream closes when Vite exits.
            }
        });
        outputReader.setDaemon(true);
        outputReader.start();

        long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(60);
        while (System.nanoTime() < deadline && process.isAlive()) {
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

    private static Path findFrontendDirectory() {
        Path workingDirectory = Path.of("").toAbsolutePath().normalize();
        for (Path candidate : List.of(workingDirectory.resolve("frontend"),
                workingDirectory.getParent().resolve("frontend"))) {
            if (Files.isRegularFile(candidate.resolve("package.json"))) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not find the frontend directory from " + workingDirectory);
    }

    @AfterAll
    static void stopFrontend() throws InterruptedException {
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

    @Autowired
    private es.codeurjc.betsphere.repository.CompetitionRepository competitions;

    @Autowired
    private es.codeurjc.betsphere.repository.TeamRepository teams;

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
    void loadMoreAppendsFinalPageOfMatches(ChromeDriver driver) {
        for (int i = 1; i <= 10; i++) {
            matchRepository.save(new Match("Home " + i, "Away " + i,
                    LocalDateTime.now().plusDays(i), 2.10, 3.40, 3.20, "SCHEDULED"));
        }

        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/matches");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        By matchRows = By.cssSelector("a.match-row");
        By loadMore = By.xpath("//button[normalize-space()='Load more']");
        var firstPage = wait.until(ExpectedConditions.numberOfElementsToBe(matchRows, 10))
                .stream().map(row -> row.getAttribute("href")).toList();

        wait.until(ExpectedConditions.elementToBeClickable(loadMore)).sendKeys(Keys.ENTER);

        var allMatches = wait.until(ExpectedConditions.numberOfElementsToBe(matchRows, 11))
                .stream().map(row -> row.getAttribute("href")).toList();
        assertThat(allMatches).startsWith(firstPage.toArray(String[]::new)).doesNotHaveDuplicates();
        wait.until(ExpectedConditions.numberOfElementsToBe(loadMore, 0));
    }

    @Test
    void userCanSignInThroughLoginForm(ChromeDriver driver) {
        signInThroughForm(driver);
    }

    private void signInThroughForm(ChromeDriver driver) {
        driver.manage().window().setSize(new Dimension(1280, 900));
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/login");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")))
                .sendKeys("user@betsphere.com");
        driver.findElement(By.id("password")).sendKeys("user123");
        driver.findElement(By.cssSelector("form button[type='submit']")).click();
        wait.until(ExpectedConditions.urlToBe("http://127.0.0.1:" + FRONTEND_PORT + "/"));

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
        var wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("a[aria-label='View profile of user@betsphere.com']"))).sendKeys(Keys.ENTER);
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
                        // Let startup's anonymous refresh finish before creating a session.
                        const { restoreSession } = await import('/app/stores/auth-store.ts');
                        await restoreSession();
                        await login({ email: 'user@betsphere.com', password: 'user123' });
                        const user = await getCurrentUser(await refreshAccessToken());
                        done(user.email);
                    })
                    .catch(error => done({ error: error.message }));
                """);

        assertThat(email).isEqualTo("user@betsphere.com");
    }

    @Test
    void logoutFromHeaderPreventsAccessToProfile(ChromeDriver driver) {
        signInThroughForm(driver);

        var wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        By logoutButton = By.cssSelector("button.header-logout");
        wait.until(ExpectedConditions.elementToBeClickable(logoutButton)).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.numberOfElementsToBe(logoutButton, 0));
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/profile");
        wait.until(ExpectedConditions.urlContains("/login?returnTo="));
    }

    @Test
    void frontendLogoutServiceRemovesRefreshCookieThroughRealApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/login");
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(30));
        Object status = driver.executeAsyncScript("""
                const done = arguments[0];
                import('/app/services/auth-service.ts')
                    .then(async ({ login, logout, refreshAccessToken }) => {
                        // Let startup's anonymous refresh finish before creating a session.
                        const { restoreSession } = await import('/app/stores/auth-store.ts');
                        await restoreSession();
                        await login({ email: 'user@betsphere.com', password: 'user123' });
                        await refreshAccessToken();
                        await logout();
                        await refreshAccessToken().then(
                            () => done('Session still active'),
                            error => done(error.status)
                        );
                    })
                    .catch(error => done({ error: error.message }));
                """);

        assertThat(status).isEqualTo(400L);
    }

    @Test
    void homeShowsSportsFromTheCatalog(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        var cards = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector("a.sport-card")));

        assertThat(cards).extracting(card -> card.findElement(By.tagName("h3")).getText())
                .contains("Football", "Basketball", "Tennis");
    }

    @Test
    void frontendSportServiceReadsRealCatalogApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        Object names = driver.executeAsyncScript("""
                const done = arguments[0];
                import('/app/services/sport-service.ts')
                    .then(({ getSports }) => getSports())
                    .then(sports => done(sports.map(sport => sport.name)))
                    .catch(error => done({ error: error.message }));
                """);

        assertThat(names).isInstanceOf(java.util.List.class);
        assertThat(((java.util.List<?>) names).stream().map(Object::toString).toList())
                .contains("Football", "Basketball", "Tennis");
    }

    @Test
    void openingSportFromHomeShowsItsCompetitions(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//a[contains(@class,'sport-card')][h3='Football']"))).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("h1"), "Football"));
        var links = wait.until(ExpectedConditions.numberOfElementsToBe(
                By.cssSelector("a.sport-competition-card"), 3));

        assertThat(links).extracting(link -> link.findElement(By.tagName("strong")).getText())
                .containsExactlyInAnyOrder("Premier League", "La Liga", "Bundesliga");
    }

    @Test
    void frontendSportDetailServiceReadsCompetitionsFromRealApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        String href = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//a[contains(@class,'sport-card')][h3='Football']"))).getAttribute("href");
        String id = href.substring(href.lastIndexOf('/') + 1);

        Object competitions = driver.executeAsyncScript("""
                const [id, done] = arguments;
                import('/app/services/sport-service.ts')
                    .then(({ getById }) => getById(Number(id)))
                    .then(sport => done(sport.competitions.map(competition => competition.name)))
                    .catch(error => done({ error: error.message }));
                """, id);

        assertThat(competitions).isInstanceOf(java.util.List.class);
        assertThat(((java.util.List<?>) competitions).stream().map(Object::toString).toList())
                .containsExactlyInAnyOrder("Premier League", "La Liga", "Bundesliga");
    }

    @Test
    void matchServiceReadsSecondPageFromRealApi(ChromeDriver driver) {
        matchRepository.save(new Match("Arsenal", "Everton", LocalDateTime.now(), 2.0, 3.0, 4.0, "SCHEDULED"));
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/matches");

        Object pages = driver.executeAsyncScript("""
                const done = arguments[0];
                import('/app/services/match-service.ts')
                    .then(async ({ getMatchesPage }) => {
                        const first = await getMatchesPage(0, 1);
                        const second = await getMatchesPage(1, 1);
                        done({
                            differentMatches: first.content[0].id !== second.content[0].id,
                            page: second.number,
                            count: second.content.length,
                            last: second.last
                        });
                    })
                    .catch(error => done({ error: error.message }));
                """);

        assertThat(pages).isEqualTo(java.util.Map.of(
                "differentMatches", true, "page", 1L, "count", 1L, "last", true));
    }

    @Test
    void openingCompetitionShowsItsScheduledMatch(ChromeDriver driver) {
        var competition = addCompetitionMatch();
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/sport/" + competition.getSport().getId());
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("a[href='/competition/" + competition.getId() + "']"))).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("h1"), "La Liga"));

        var matches = wait.until(ExpectedConditions.numberOfElementsToBe(By.cssSelector("a.match-row"), 2));
        assertThat(matches).allSatisfy(match -> assertThat(match.getText()).contains("Valencia", "Sevilla"));
    }

    @Test
    void frontendCompetitionServiceReadsScheduleFromRealApi(ChromeDriver driver) {
        var competition = addCompetitionMatch();
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");

        Object result = driver.executeAsyncScript("""
                const [id, done] = arguments;
                import('/app/services/competition-service.ts')
                    .then(({ getById }) => getById(id))
                    .then(competition => done(competition.matches.map(match => match.homeTeam)))
                    .catch(error => done({ error: error.message }));
                """, competition.getId());

        assertThat(result).isEqualTo(java.util.List.of("Valencia"));
    }

    private es.codeurjc.betsphere.model.Competition addCompetitionMatch() {
        var competition = competitions.findAll().stream().filter(item -> "La Liga".equals(item.getName()))
                .findFirst().orElseThrow();
        var match = new Match("Valencia", "Sevilla", LocalDateTime.now().plusDays(2), 2.0, 3.0, 4.0, "SCHEDULED");
        match.setCompetition(competition);
        matchRepository.save(match);
        return competition;
    }

    @Test
    void openingMatchShowsBothTeamsAndHomeOdds(ChromeDriver driver) {
        var match = addMatchWithTeams();
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/matches");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("a.match-row[href='/match/" + match.getId() + "']"))).sendKeys(Keys.ENTER);

        var titles = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector("h1.match-team-title")));
        assertThat(titles).extracting(org.openqa.selenium.WebElement::getText)
                .containsExactly("Real Madrid", "Barcelona");
        assertThat(driver.findElement(By.cssSelector("button[aria-label='Odds 1 disabled']")).getText())
                .contains("2.10");
    }

    @Test
    void frontendMatchServiceReadsDetailFromRealApi(ChromeDriver driver) {
        var match = addMatchWithTeams();
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");

        Object result = driver.executeAsyncScript("""
                const [id, done] = arguments;
                import('/app/services/match-service.ts')
                    .then(({ getMatchById }) => getMatchById(id))
                    .then(match => done([match.homeTeam.name, match.awayTeam.name, match.competition.name]))
                    .catch(error => done({ error: error.message }));
                """, match.getId());

        assertThat(result).isEqualTo(java.util.List.of("Real Madrid", "Barcelona", "La Liga"));
    }

    private Match addMatchWithTeams() {
        var competition = competitions.findAll().stream().filter(item -> "La Liga".equals(item.getName()))
                .findFirst().orElseThrow();
        var match = new Match("Real Madrid", "Barcelona", LocalDateTime.now().plusDays(2),
                2.10, 3.40, 3.20, "SCHEDULED");
        match.setCompetition(competition);
        match.setHomeTeamRef(teams.findByName("Real Madrid").orElseThrow());
        match.setAwayTeamRef(teams.findByName("Barcelona").orElseThrow());
        return matchRepository.save(match);
    }

    @Test
    void openingTeamFromCompetitionShowsItsProfile(ChromeDriver driver) {
        var competition = competitions.findAll().stream().filter(item -> "La Liga".equals(item.getName()))
                .findFirst().orElseThrow();
        var team = teams.findByName("Real Madrid").orElseThrow();
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/competition/" + competition.getId());
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("a.team-link[href='/team/" + team.getId() + "']"))).sendKeys(Keys.ENTER);

        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("h1"), "Real Madrid"));
        assertThat(driver.findElement(By.tagName("main")).getText()).contains("Spain", "Season performance");
        assertThat(driver.findElement(By.cssSelector("a.back-link")).getAttribute("href"))
                .endsWith("/competition/" + competition.getId());
    }

    @Test
    void frontendTeamServiceReadsProfileFromRealApi(ChromeDriver driver) {
        var team = teams.findByName("Real Madrid").orElseThrow();
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");

        Object result = driver.executeAsyncScript("""
                const [id, done] = arguments;
                import('/app/services/team-service.ts')
                    .then(({ getTeam }) => getTeam(id))
                    .then(team => done([team.name, team.country, team.totalMatches]))
                    .catch(error => done({ error: error.message }));
                """, team.getId());

        assertThat(result).isEqualTo(java.util.List.of("Real Madrid", "Spain", (long) team.getTotalMatches()));
    }

    @Test
    void administratorCanOpenPanelAndListUsers(ChromeDriver driver) {
        String baseUrl = "http://127.0.0.1:" + FRONTEND_PORT;
        driver.get(baseUrl + "/admin");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.urlContains("/login?returnTo="));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys("admin@betsphere.com");
        driver.findElement(By.id("password")).sendKeys("admin123");
        driver.findElement(By.cssSelector("form button[type='submit']")).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.urlToBe(baseUrl + "/admin"));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[@role='tab' and starts-with(normalize-space(), 'Users')]")))
                .sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.cssSelector("tbody"), "user@betsphere.com"));
    }

    @Test
    void regularUserCannotOpenAdminPanel(ChromeDriver driver) {
        signInThroughForm(driver);
        String baseUrl = "http://127.0.0.1:" + FRONTEND_PORT;
        driver.get(baseUrl + "/admin");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("a.sport-card")));
    }

    @Test
    void adminUserServiceReadsUsersFromRealApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        Object result = driver.executeAsyncScript("""
                const done = arguments[0];
                (async () => {
                    const { login, getCurrentUser } = await import('/app/services/auth-service.ts');
                    const { restoreSession, useAuthStore } = await import('/app/stores/auth-store.ts');
                    const { getUsersPage } = await import('/app/services/user-service.ts');
                    await restoreSession();
                    const session = await login({ email: 'admin@betsphere.com', password: 'admin123' });
                    useAuthStore.getState().setSession(session.accessToken, await getCurrentUser(session.accessToken));
                    const page = await getUsersPage(0, 1);
                    done({ count: page.content.length, page: page.number, hasMore: !page.last });
                })().catch(error => done({ error: error.message }));
                """);

        assertThat(result).isEqualTo(java.util.Map.of("count", 1L, "page", 0L, "hasMore", true));
    }

    @Test
    void administratorCanCreateEditAndDeleteSport(ChromeDriver driver) {
        String baseUrl = "http://127.0.0.1:" + FRONTEND_PORT;
        driver.get(baseUrl + "/admin");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys("admin@betsphere.com");
        driver.findElement(By.id("password")).sendKeys("admin123");
        driver.findElement(By.cssSelector("form button[type='submit']")).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.urlToBe(baseUrl + "/admin"));

        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[normalize-space()='New record']")))
                .sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-name"))).sendKeys("Browser sport QA");
        saveAdminSport(wait);

        By created = By.xpath("//tbody/tr[td[normalize-space()='Browser sport QA']]");
        wait.until(ExpectedConditions.visibilityOfElementLocated(created))
                .findElement(By.xpath(".//button[normalize-space()='Edit']")).sendKeys(Keys.ENTER);
        var name = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-name")));
        name.clear();
        name.sendKeys("Updated browser sport QA");
        saveAdminSport(wait);

        By updated = By.xpath("//tbody/tr[td[normalize-space()='Updated browser sport QA']]");
        wait.until(ExpectedConditions.visibilityOfElementLocated(updated))
                .findElement(By.xpath(".//button[normalize-space()='Delete']")).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("[role='dialog'] button[type='submit']")))
                .sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.numberOfElementsToBe(updated, 0));
    }

    private void saveAdminSport(WebDriverWait wait) {
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//section[@aria-label='Sports form']//button[@type='submit']"))).sendKeys(Keys.ENTER);
    }

    @Test
    void frontendSportServiceManagesSportThroughRealApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        Object result = driver.executeAsyncScript("""
                const done = arguments[0];
                (async () => {
                    const { login, getCurrentUser } = await import('/app/services/auth-service.ts');
                    const { restoreSession, useAuthStore } = await import('/app/stores/auth-store.ts');
                    const { addSport, updateSport, deleteSport, getSports } = await import('/app/services/sport-service.ts');
                    await restoreSession();
                    const session = await login({ email: 'admin@betsphere.com', password: 'admin123' });
                    useAuthStore.getState().setSession(session.accessToken, await getCurrentUser(session.accessToken));
                    const created = await addSport({ name: 'Client sport QA' });
                    const updated = await updateSport(created.id, { name: 'Updated client sport QA' });
                    await deleteSport(created.id);
                    const sports = await getSports();
                    done({ created: created.name, updated: updated.name, deleted: !sports.some(sport => sport.id === created.id) });
                })().catch(error => done({ error: error.message }));
                """);

        assertThat(result).isEqualTo(java.util.Map.of(
                "created", "Client sport QA", "updated", "Updated client sport QA", "deleted", true));
    }

    @Test
    void administratorCanCreateEditAndDeleteCompetition(ChromeDriver driver) {
        String baseUrl = "http://127.0.0.1:" + FRONTEND_PORT;
        driver.get(baseUrl + "/admin");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys("admin@betsphere.com");
        driver.findElement(By.id("password")).sendKeys("admin123");
        driver.findElement(By.cssSelector("form button[type='submit']")).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.urlToBe(baseUrl + "/admin"));
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[@role='tab' and starts-with(normalize-space(), 'Competitions')]"))).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[normalize-space()='New record']")))
                .sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-name"))).sendKeys("Browser League QA");
        driver.findElement(By.id("admin-country")).sendKeys("Spain");
        new org.openqa.selenium.support.ui.Select(driver.findElement(By.id("admin-sportId")))
                .selectByVisibleText("Football");
        By submit = By.cssSelector("[aria-label='Competitions form'] button[type='submit']");
        wait.until(ExpectedConditions.elementToBeClickable(submit)).sendKeys(Keys.ENTER);

        By created = By.xpath("//tbody/tr[td[normalize-space()='Browser League QA']]");
        wait.until(ExpectedConditions.visibilityOfElementLocated(created))
                .findElement(By.xpath(".//button[normalize-space()='Edit']")).sendKeys(Keys.ENTER);
        var name = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-name")));
        name.clear();
        name.sendKeys("Updated Browser League QA");
        wait.until(ExpectedConditions.elementToBeClickable(submit)).sendKeys(Keys.ENTER);

        By updated = By.xpath("//tbody/tr[td[normalize-space()='Updated Browser League QA']]");
        wait.until(ExpectedConditions.visibilityOfElementLocated(updated))
                .findElement(By.xpath(".//button[normalize-space()='Delete']")).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("[role='dialog'] button[type='submit']")))
                .sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.numberOfElementsToBe(updated, 0));
    }

    @Test
    void frontendCompetitionServiceManagesCompetitionThroughRealApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        Object result = driver.executeAsyncScript("""
                const done = arguments[0];
                (async () => {
                    const { login, getCurrentUser } = await import('/app/services/auth-service.ts');
                    const { restoreSession, useAuthStore } = await import('/app/stores/auth-store.ts');
                    const { getSports } = await import('/app/services/sport-service.ts');
                    const { addCompetition, updateCompetition, deleteCompetition, getCompetitions } =
                        await import('/app/services/competition-service.ts');
                    await restoreSession();
                    const session = await login({ email: 'admin@betsphere.com', password: 'admin123' });
                    useAuthStore.getState().setSession(session.accessToken, await getCurrentUser(session.accessToken));
                    const sportId = (await getSports()).find(sport => sport.name === 'Football').id;
                    const created = await addCompetition({ name: 'Client League QA', country: 'Spain', sportId });
                    const updated = await updateCompetition(created.id, { name: created.name, country: 'France', sportId });
                    await deleteCompetition(created.id);
                    const competitions = await getCompetitions();
                    done({ sport: created.sport.name, country: updated.country,
                        deleted: !competitions.some(competition => competition.id === created.id) });
                })().catch(error => done({ error: error.message }));
                """);

        assertThat(result).isEqualTo(java.util.Map.of("sport", "Football", "country", "France", "deleted", true));
    }

    @Test
    void administratorCanCreateEditAndDeleteTeam(ChromeDriver driver) {
        var wait = openAdminTab(driver, "Teams");
        openNewAdminRecord(wait);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-name"))).sendKeys("Browser Team QA");
        driver.findElement(By.id("admin-country")).sendKeys("Spain");
        selectAdminOption(driver, "competitionId", "La Liga");
        saveAdminRecord(wait, "Teams");
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("[aria-label='Teams form']")));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[normalize-space()='Load more']")))
                .sendKeys(Keys.ENTER);

        By created = adminRow("Browser Team QA");
        openAdminRowAction(wait, created, "Edit");
        var name = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-name")));
        name.clear();
        name.sendKeys("Updated Browser Team QA");
        saveAdminRecord(wait, "Teams");
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("[aria-label='Teams form']")));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[normalize-space()='Load more']")))
                .sendKeys(Keys.ENTER);

        deleteAdminRecord(wait, adminRow("Updated Browser Team QA"));
    }

    @Test
    void frontendTeamServicesManageTeamThroughRealApi(ChromeDriver driver) {
        Object result = runAuthenticatedAdminScript(driver, """
                const { createTeam, getCompetitions, getById } = await import('/app/services/competition-service.ts');
                const { updateTeam, deleteTeam, getTeams } = await import('/app/services/team-service.ts');
                const competition = (await getCompetitions()).find(item => item.name === 'La Liga');
                const created = await createTeam(competition.id, { name: 'Client Team QA', country: 'Spain', logoUrl: null });
                const linked = (await getById(competition.id)).teams.some(team => team.id === created.id);
                const updated = await updateTeam(created.id, { name: created.name, country: 'France', logoUrl: null });
                await deleteTeam(created.id);
                return { linked, country: updated.country, deleted: !(await getTeams()).some(team => team.id === created.id) };
                """);

        assertThat(result).isEqualTo(java.util.Map.of("linked", true, "country", "France", "deleted", true));
    }

    private WebDriverWait openAdminTab(ChromeDriver driver, String tab) {
        String baseUrl = "http://127.0.0.1:" + FRONTEND_PORT;
        driver.get(baseUrl + "/admin");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email"))).sendKeys("admin@betsphere.com");
        driver.findElement(By.id("password")).sendKeys("admin123");
        driver.findElement(By.cssSelector("form button[type='submit']")).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.urlToBe(baseUrl + "/admin"));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(
                "//button[@role='tab' and starts-with(normalize-space(), '" + tab + "')]"))).sendKeys(Keys.ENTER);
        return wait;
    }

    private void openNewAdminRecord(WebDriverWait wait) {
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[normalize-space()='New record']")))
                .sendKeys(Keys.ENTER);
    }

    private void selectAdminOption(ChromeDriver driver, String field, String option) {
        new org.openqa.selenium.support.ui.Select(driver.findElement(By.id("admin-" + field)))
                .selectByVisibleText(option);
    }

    private void saveAdminRecord(WebDriverWait wait, String tab) {
        wait.until(ExpectedConditions.elementToBeClickable(
                By.cssSelector("[aria-label='" + tab + " form'] button[type='submit']"))).sendKeys(Keys.ENTER);
    }

    private By adminRow(String label) {
        return By.xpath("//tbody/tr[td[normalize-space()='" + label + "']]");
    }

    private void openAdminRowAction(WebDriverWait wait, By row, String action) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(row))
                .findElement(By.xpath(".//button[normalize-space()='" + action + "']")).sendKeys(Keys.ENTER);
    }

    private void deleteAdminRecord(WebDriverWait wait, By row) {
        openAdminRowAction(wait, row, "Delete");
        wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("[role='dialog'] button[type='submit']")))
                .sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("[role='dialog']")));
        wait.until(ExpectedConditions.numberOfElementsToBe(row, 0));
    }

    private Object runAuthenticatedAdminScript(ChromeDriver driver, String script) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        return driver.executeAsyncScript("""
                const done = arguments[0];
                (async () => {
                    const { login, getCurrentUser } = await import('/app/services/auth-service.ts');
                    const { restoreSession, useAuthStore } = await import('/app/stores/auth-store.ts');
                    await restoreSession();
                    const session = await login({ email: 'admin@betsphere.com', password: 'admin123' });
                    useAuthStore.getState().setSession(session.accessToken, await getCurrentUser(session.accessToken));
                """ + script + """
                })().then(done).catch(error => done({ error: error.message }));
                """);
    }

}

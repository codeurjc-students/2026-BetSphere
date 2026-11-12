package es.codeurjc.betsphere.e2e.ui;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import es.codeurjc.betsphere.model.Match;
import java.time.Duration;
import java.time.LocalDateTime;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import es.codeurjc.betsphere.support.BrowserTestSupport;

class BetSphereUiE2ETest extends BrowserTestSupport {

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
    void homeShowsSportsFromTheCatalog(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        var cards = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector("a.sport-card")));

        assertThat(cards).extracting(card -> card.findElement(By.tagName("h3")).getText())
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
    void administratorCanCreateEditAndDeleteMatch(ChromeDriver driver) {
        var wait = openAdminTab(driver, "Matches");
        openNewAdminRecord(wait);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-matchDate")));
        selectAdminOption(driver, "competitionId", "La Liga");
        selectAdminOption(driver, "homeTeamId", "Barcelona");
        selectAdminOption(driver, "awayTeamId", "Atletico Madrid");
        selectAdminOption(driver, "gameStatus", "Scheduled");
        driver.executeScript("arguments[0].value = arguments[1]",
                driver.findElement(By.id("admin-matchDate")), "2030-06-01T18:00");
        saveAdminRecord(wait, "Matches");

        By created = By.xpath("//tbody/tr[td[normalize-space()='Barcelona vs Atletico Madrid'] and td[contains(.,'SCHEDULED')]]");
        openAdminRowAction(wait, created, "Edit");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("admin-gameStatus")));
        selectAdminOption(driver, "gameStatus", "Finished");
        saveAdminRecord(wait, "Matches");

        By updated = By.xpath("//tbody/tr[td[normalize-space()='Barcelona vs Atletico Madrid'] and td[contains(.,'FINISHED')]]");
        deleteAdminRecord(wait, updated);
    }

    @Test
    void profileAndHistoryRequireSignIn(ChromeDriver driver) {
        String baseUrl = "http://127.0.0.1:" + FRONTEND_PORT;
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        for (String route : java.util.List.of("/profile", "/history")) {
            driver.get(baseUrl + route);
            wait.until(ExpectedConditions.urlToBe(baseUrl + "/login?returnTo=%2F" + route.substring(1)));
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));
        }
    }

    @Test
    void signedInUserCanOpenProfileAndViewEmptyHistory(ChromeDriver driver) {
        signInThroughForm(driver);
        String baseUrl = "http://127.0.0.1:" + FRONTEND_PORT;
        driver.get(baseUrl + "/profile");
        var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("h1"), "My Profile"));
        assertThat(driver.findElement(By.tagName("main")).getText()).contains("user@betsphere.com", "€0.00");

        wait.until(ExpectedConditions.elementToBeClickable(By.linkText("View my history"))).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.tagName("h1"), "History"));
        assertThat(driver.findElement(By.tagName("main")).getText()).contains("€0.00", "No activity to display yet");
    }

    @Test
    void profilePhotoSurvivesReload(ChromeDriver driver) throws Exception {
        Path photo = Files.createTempFile("betsphere-avatar-", ".png");
        try {
            javax.imageio.ImageIO.write(new java.awt.image.BufferedImage(1, 1,
                    java.awt.image.BufferedImage.TYPE_INT_RGB), "png", photo.toFile());
            signInThroughForm(driver);
            driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/profile");
            var wait = new WebDriverWait(driver, Duration.ofSeconds(60));
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='file']")))
                    .sendKeys(photo.toString());
            wait.until(ExpectedConditions.textToBePresentInElementLocated(
                    By.cssSelector("[role='status']"), "Profile photo updated."));
            String source = driver.findElement(By.cssSelector(".profile-avatar img")).getAttribute("src");
            driver.navigate().refresh();
            var avatar = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".profile-avatar img")));
            wait.until(webDriver -> Boolean.TRUE.equals(driver.executeScript(
                    "return arguments[0].complete && arguments[0].naturalWidth > 0", avatar)));
            assertThat(avatar.getAttribute("src")).isEqualTo(source).contains("/api/v1/images/");
        } finally {
            Files.deleteIfExists(photo);
            var user = accountUsers.findByEmail("user@betsphere.com").orElseThrow();
            user.setAvatarUrl(null);
            accountUsers.save(user);
        }
    }

    private void setBirthDate(ChromeDriver driver, String date) {
        driver.executeScript("arguments[0].value = arguments[1];",
                driver.findElement(By.id("birthDate")), date);
    }

    private void saveAdminSport(WebDriverWait wait) {
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//section[@aria-label='Sports form']//button[@type='submit']"))).sendKeys(Keys.ENTER);
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
}

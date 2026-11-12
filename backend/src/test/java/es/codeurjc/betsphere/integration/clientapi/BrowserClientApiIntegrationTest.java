package es.codeurjc.betsphere.integration.clientapi;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import es.codeurjc.betsphere.model.Match;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import es.codeurjc.betsphere.support.BrowserTestSupport;

class BrowserClientApiIntegrationTest extends BrowserTestSupport {

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

        assertThat(result).isEqualTo(Map.of("status", "SUCCESS", "email", "user@betsphere.com"));
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
    void frontendSportServiceReadsRealCatalogApi(ChromeDriver driver) {
        driver.get("http://127.0.0.1:" + FRONTEND_PORT + "/");
        Object names = driver.executeAsyncScript("""
                const done = arguments[0];
                import('/app/services/sport-service.ts')
                    .then(({ getSports }) => getSports())
                    .then(sports => done(sports.map(sport => sport.name)))
                    .catch(error => done({ error: error.message }));
                """);

        assertThat(names).isInstanceOf(List.class);
        assertThat(((List<?>) names).stream().map(Object::toString).toList())
                .contains("Football", "Basketball", "Tennis");
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

        assertThat(competitions).isInstanceOf(List.class);
        assertThat(((List<?>) competitions).stream().map(Object::toString).toList())
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

        assertThat(pages).isEqualTo(Map.of(
                "differentMatches", true, "page", 1L, "count", 1L, "last", true));
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

        assertThat(result).isEqualTo(List.of("Valencia"));
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

        assertThat(result).isEqualTo(List.of("Real Madrid", "Barcelona", "La Liga"));
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

        assertThat(result).isEqualTo(List.of("Real Madrid", "Spain", (long) team.getTotalMatches()));
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

        assertThat(result).isEqualTo(Map.of("count", 1L, "page", 0L, "hasMore", true));
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

        assertThat(result).isEqualTo(Map.of(
                "created", "Client sport QA", "updated", "Updated client sport QA", "deleted", true));
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

        assertThat(result).isEqualTo(Map.of("sport", "Football", "country", "France", "deleted", true));
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

        assertThat(result).isEqualTo(Map.of("linked", true, "country", "France", "deleted", true));
    }

    @Test
    void frontendMatchServiceManagesMatchThroughRealApi(ChromeDriver driver) {
        Object result = runAuthenticatedAdminScript(driver, """
                const { getCompetitions } = await import('/app/services/competition-service.ts');
                const { addMatch, updateMatch, deleteMatch, getMatches } = await import('/app/services/match-service.ts');
                const competition = (await getCompetitions()).find(item => item.name === 'La Liga');
                const [home, away] = competition.teams;
                const payload = {
                    homeTeam: home.name, awayTeam: away.name, homeTeamId: home.id, awayTeamId: away.id,
                    competitionId: competition.id, matchDate: '2030-06-01T18:00:00',
                    homeOdds: null, drawOdds: null, awayOdds: null, gameStatus: 'SCHEDULED'
                };
                const created = await addMatch(payload);
                const updated = await updateMatch(created.id, { ...payload, gameStatus: 'FINISHED' });
                await deleteMatch(created.id);
                return { created: created.gameStatus, updated: updated.gameStatus,
                    deleted: !(await getMatches()).some(match => match.id === created.id) };
                """);

        assertThat(result).isEqualTo(Map.of("created", "SCHEDULED", "updated", "FINISHED", "deleted", true));
    }

    @Test
    void frontendLoadsPersistedAccountThroughRealApi(ChromeDriver driver) {
        signInThroughForm(driver);
        Object account = driver.executeAsyncScript("""
                const done = arguments[0];
                (async () => {
                    const { useAuthStore } = await import('/app/stores/auth-store.ts');
                    const { getCurrentUser } = await import('/app/services/auth-service.ts');
                    const user = await getCurrentUser(useAuthStore.getState().accessToken);
                    done([user.username, user.email]);
                })().catch(error => done({ error: error.message }));
                """);

        assertThat(account).isEqualTo(List.of("user", "user@betsphere.com"));
    }

    @Test
    void profileClientUploadsAvatarThroughRealApi(ChromeDriver driver) throws Exception {
        try {
            signInThroughForm(driver);
            Object avatar = driver.executeAsyncScript("""
                    const done = arguments[0];
                    (async () => {
                        const { clientAction } = await import('/app/routes/profile.tsx');
                        const body = new FormData();
                        body.append('avatar', new File([new Uint8Array([1, 2, 3])], 'avatar.png', { type: 'image/png' }));
                        const request = new Request(location.origin + '/profile', { method: 'POST', body });
                        const { avatarUrl } = await clientAction({ request });
                        const response = await fetch(avatarUrl);
                        return { status: response.status, bytes: Array.from(new Uint8Array(await response.arrayBuffer())) };
                    })().then(done).catch(error => done({ error: error.message }));
                    """);

            assertThat(avatar).isEqualTo(Map.of("status", 200L, "bytes", List.of(1L, 2L, 3L)));
        } finally {
            var user = accountUsers.findByEmail("user@betsphere.com").orElseThrow();
            user.setAvatarUrl(null);
            accountUsers.save(user);
        }
    }

    @Test
    void adminClientUploadsAndReadsCatalogImagesThroughRealApi(ChromeDriver driver) {
        Object result = runAuthenticatedAdminScript(driver, """
                    const { performAdminAction } = await import('/app/services/admin-actions.ts');
                    const sports = await import('/app/services/sport-service.ts');
                    const competitions = await import('/app/services/competition-service.ts');
                    const teams = await import('/app/services/team-service.ts');
                    const football = (await sports.getSports()).find(sport => sport.name === 'Football');
                    const laLiga = (await competitions.getCompetitions()).find(league => league.name === 'La Liga');
                    const barcelona = (await teams.getTeams()).find(team => team.name === 'Barcelona');
                    const targets = [
                        { entity: 'sports', row: football, read: sports.getById, imageField: 'iconUrl' },
                        { entity: 'competitions', row: laLiga, read: competitions.getById, imageField: 'iconUrl' },
                        { entity: 'teams', row: barcelona, read: teams.getTeam, imageField: 'logoUrl' },
                    ];
                    const results = [];
                    for (const { entity, row, read, imageField } of targets) {
                        const body = new FormData();
                        for (const [name, value] of Object.entries({
                            entity, intent: 'edit', id: row.id, name: row.name,
                            country: row.country ?? '', sportId: football.id,
                        })) body.set(name, String(value));
                        body.set('image', new File([new Uint8Array([1, 2, 3])], 'logo.png', { type: 'image/png' }));
                        const request = new Request(location.origin + '/admin', { method: 'POST', body });
                        const action = await performAdminAction(request);
                        if (!action.ok || action.warning) throw new Error(JSON.stringify(action));
                        const saved = await read(row.id);
                        const response = await fetch(saved[imageField]);
                        results.push({
                            entity, status: response.status,
                            bytes: Array.from(new Uint8Array(await response.arrayBuffer())),
                        });
                    }
                    return results;
                """);

        assertThat(result).isEqualTo(List.of(
                Map.of("entity", "sports", "status", 200L, "bytes", List.of(1L, 2L, 3L)),
                Map.of("entity", "competitions", "status", 200L, "bytes", List.of(1L, 2L, 3L)),
                Map.of("entity", "teams", "status", 200L, "bytes", List.of(1L, 2L, 3L))));
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

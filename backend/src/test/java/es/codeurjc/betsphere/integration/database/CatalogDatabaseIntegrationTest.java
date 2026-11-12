package es.codeurjc.betsphere.integration.database;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import es.codeurjc.betsphere.model.Competition;
import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.model.Sport;
import es.codeurjc.betsphere.model.Team;
import es.codeurjc.betsphere.repository.CompetitionRepository;
import es.codeurjc.betsphere.service.CompetitionService;
import es.codeurjc.betsphere.service.MatchService;
import es.codeurjc.betsphere.repository.SportRepository;
import es.codeurjc.betsphere.repository.TeamRepository;
import es.codeurjc.betsphere.service.SportService;
import es.codeurjc.betsphere.service.TeamService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Pageable;
import org.springframework.context.annotation.Import;
import es.codeurjc.betsphere.support.MysqlTestConfiguration;
import jakarta.transaction.Transactional;

@SpringBootTest
@Import(MysqlTestConfiguration.class)
class CatalogDatabaseIntegrationTest {

    @Autowired
    private CompetitionRepository competitions;

    @Autowired
    private CompetitionService competitionService;

    @Autowired
    private SportRepository sports;

    @Autowired
    private TeamRepository teams;

    @Autowired
    private SportService sportService;

    @Autowired
    private TeamService teamService;

    @Autowired
    private MatchService matchService;

    @Test
    void sportServiceReadsNewlyPersistedSport() {
        var saved = sports.save(new Sport("Volleyball", null));

        assertThat(sportService.findAll(Pageable.unpaged()).getContent())
                .extracting(Sport::getId).contains(saved.getId());
    }

    @Test
    @Transactional
    void sportServiceLoadsCompetitionRelationshipsFromMysql() {
        var football = sports.findByName("Football").orElseThrow();

        assertThat(sportService.findById(football.getId()).getCompetitions())
                .extracting(Competition::getName)
                .containsExactlyInAnyOrder("Premier League", "La Liga", "Bundesliga");
    }

    @Test
    @Transactional
    void competitionServiceLoadsItsScheduleFromMysql() {
        assertThat(competitionService.findById(laLigaId()).getMatches())
                .extracting(Match::getHomeTeam)
                .containsExactlyInAnyOrder("Real Madrid", "Atletico Madrid");
    }

    private Long laLigaId() {
        return competitions.findAll().stream().filter(competition -> "La Liga".equals(competition.getName()))
                .map(Competition::getId).findFirst().orElseThrow();
    }

    @Test
    @Transactional
    void matchServiceLoadsItsTeamsAndOddsFromMysql() {
        var match = matchService.getMatch(madridBarcelonaId());

        assertThat(match.getHomeTeamRef().getName()).isEqualTo("Real Madrid");
        assertThat(match.getAwayTeamRef().getName()).isEqualTo("Barcelona");
        assertThat(match.getHomeOdds()).isEqualTo(2.10);
    }

    private Long madridBarcelonaId() {
        return competitionService.findById(laLigaId()).getMatches().stream()
                .filter(match -> "Barcelona".equals(match.getAwayTeam()))
                .map(Match::getId).findFirst().orElseThrow();
    }

    @Test
    void teamServiceReadsPersistedProfileFromMysql() {
        var saved = teams.save(new Team("Valencia QA", "Spain", null));

        var profile = teamService.findById(saved.getId());

        assertThat(profile.getName()).isEqualTo("Valencia QA");
        assertThat(profile.getCountry()).isEqualTo("Spain");
    }

    @Test
    void sportServicePersistsChangesAndDeletesFromMysql() {
        var saved = sportService.save(new Sport("Database sport QA", null));
        try {
            assertThat(sports.findById(saved.getId())).isPresent();
            sportService.update(saved.getId(), new Sport("Updated database sport QA", null));
            assertThat(sports.findById(saved.getId()).orElseThrow().getName())
                    .isEqualTo("Updated database sport QA");
        } finally {
            sportService.delete(saved.getId());
        }
        assertThat(sports.existsById(saved.getId())).isFalse();
    }

    @Test
    void competitionServicePersistsSportAndCountryChangesInMysql() {
        var football = sports.findByName("Football").orElseThrow();
        var basketball = sports.findByName("Basketball").orElseThrow();
        var saved = competitionService.save(new Competition("Database League QA", "Spain", null, null),
                football.getId());
        try {
            assertThat(competitions.findById(saved.getId()).orElseThrow().getSport().getId())
                    .isEqualTo(football.getId());
            competitionService.update(saved.getId(),
                    new Competition("Updated Database League QA", "France", null, null), basketball.getId());

            var updated = competitions.findById(saved.getId()).orElseThrow();
            assertThat(updated.getName()).isEqualTo("Updated Database League QA");
            assertThat(updated.getCountry()).isEqualTo("France");
            assertThat(updated.getSport().getId()).isEqualTo(basketball.getId());
        } finally {
            competitionService.delete(saved.getId());
        }
        assertThat(competitions.existsById(saved.getId())).isFalse();
    }

    @Test
    void teamServicesPersistCompetitionMembershipAndProfileChanges() {
        long competitionId = laLigaId();
        var created = competitionService.createAndLinkTeam(competitionId,
                new Team("Database Team QA", "Spain", null));
        try {
            assertThat(competitions.findById(competitionId).orElseThrow().getTeams())
                    .extracting(Team::getId).contains(created.getId());
            teamService.update(created.getId(),
                    new Team("Updated Database Team QA", "France", null));
            assertThat(teams.findById(created.getId()).orElseThrow().getCountry()).isEqualTo("France");
        } finally {
            teamService.delete(created.getId());
        }
        assertThat(teams.existsById(created.getId())).isFalse();
        assertThat(competitions.findById(competitionId).orElseThrow().getTeams())
                .extracting(Team::getId).doesNotContain(created.getId());
    }

    @Test
    void matchServicePersistsScheduleAndStatusChangesInMysql() {
        var fixture = matchService.getMatch(madridBarcelonaId());
        var match = new Match("Real Madrid", "Barcelona", LocalDateTime.of(2030, 6, 1, 18, 0),
                2.0, 3.0, 4.0, "SCHEDULED");
        match.setCompetition(fixture.getCompetition());
        match.setHomeTeamRef(fixture.getHomeTeamRef());
        match.setAwayTeamRef(fixture.getAwayTeamRef());

        var saved = matchService.create(match);
        try {
            assertThat(matchService.getMatch(saved.getId()).getGameStatus()).isEqualTo("SCHEDULED");
            match.setGameStatus("FINISHED");
            matchService.update(saved.getId(), match);
            assertThat(matchService.getMatch(saved.getId()).getGameStatus()).isEqualTo("FINISHED");
        } finally {
            matchService.delete(saved.getId());
        }
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> matchService.getMatch(saved.getId()))
                .isInstanceOf(NoSuchElementException.class);
    }
}

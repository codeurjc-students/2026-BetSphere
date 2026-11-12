package es.codeurjc.betsphere.unit.service;

import es.codeurjc.betsphere.service.TeamService;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import es.codeurjc.betsphere.model.Team;
import es.codeurjc.betsphere.repository.MatchRepository;
import es.codeurjc.betsphere.repository.TeamRepository;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class TeamServiceTest {

    @Test
    void rejectsAnUnknownTeam() {
        var teams = mock(TeamRepository.class);
        when(teams.findById(99L)).thenReturn(Optional.empty());
        var service = new TeamService(teams, mock(MatchRepository.class));

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Team not found.");
    }

    @Test
    void rejectsDeletionOfTeamThatPlaysMatches() {
        var teams = mock(TeamRepository.class);
        var matches = mock(MatchRepository.class);
        var team = new Team("Football QA", "Spain", null);
        when(teams.findById(12L)).thenReturn(Optional.of(team));
        when(matches.existsByHomeTeamRef_IdOrAwayTeamRef_Id(12L, 12L)).thenReturn(true);

        assertThatThrownBy(() -> new TeamService(teams, matches).delete(12L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Cannot delete a team that participates in matches.");
        Mockito.verify(teams, Mockito.never()).delete(team);
    }
}

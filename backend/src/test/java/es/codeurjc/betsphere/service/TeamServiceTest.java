package es.codeurjc.betsphere.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import es.codeurjc.betsphere.repository.MatchRepository;
import es.codeurjc.betsphere.repository.TeamRepository;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.junit.jupiter.api.Test;

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
}

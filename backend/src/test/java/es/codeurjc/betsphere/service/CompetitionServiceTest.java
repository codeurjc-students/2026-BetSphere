package es.codeurjc.betsphere.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

import es.codeurjc.betsphere.repository.CompetitionRepository;
import es.codeurjc.betsphere.repository.MatchRepository;
import es.codeurjc.betsphere.repository.TeamRepository;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.Test;

class CompetitionServiceTest {

    @Test
    void rejectsAnUnknownCompetition() {
        var service = new CompetitionService(mock(CompetitionRepository.class), mock(SportService.class),
                mock(TeamRepository.class), mock(MatchRepository.class));

        assertThatThrownBy(() -> service.findById(99L)).isInstanceOf(NoSuchElementException.class);
    }
}

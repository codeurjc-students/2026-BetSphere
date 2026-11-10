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

    @Test
    void rejectsDuplicateCompetitionNameBeforeWriting() {
        var competitions = mock(CompetitionRepository.class);
        org.mockito.Mockito.when(competitions.existsByNameIgnoreCase("La Liga")).thenReturn(true);
        var service = new CompetitionService(competitions, mock(SportService.class),
                mock(TeamRepository.class), mock(MatchRepository.class));
        var duplicate = new es.codeurjc.betsphere.model.Competition(" La Liga ", "Spain", null, null);

        assertThatThrownBy(() -> service.save(duplicate, 1L)).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("A competition with this name already exists.");
        org.mockito.Mockito.verify(competitions, org.mockito.Mockito.never()).save(duplicate);
    }
}

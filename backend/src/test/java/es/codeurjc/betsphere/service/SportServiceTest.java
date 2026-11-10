package es.codeurjc.betsphere.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import es.codeurjc.betsphere.model.Sport;
import es.codeurjc.betsphere.repository.SportRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

class SportServiceTest {

    @Test
    void returnsRequestedPageWithRepositoryMetadata() {
        var repository = mock(SportRepository.class);
        var request = PageRequest.of(1, 1);
        when(repository.findAll(request))
                .thenReturn(new PageImpl<>(List.of(new Sport("Tennis", null)), request, 2));

        var page = new SportService(repository).findAll(request);

        assertThat(page.getContent()).extracting(Sport::getName).containsExactly("Tennis");
        assertThat(page.getNumber()).isEqualTo(1);
        assertThat(page.getTotalElements()).isEqualTo(2);
    }

    @Test
    void unknownSportProducesNotFoundError() {
        var repository = mock(SportRepository.class);
        when(repository.findById(99L)).thenReturn(java.util.Optional.empty());

        org.assertj.core.api.Assertions.assertThatThrownBy(() -> new SportService(repository).findById(99L))
                .isInstanceOf(java.util.NoSuchElementException.class)
                .hasMessage("Sport not found.");
    }

    @Test
    void rejectsDeletionWhenSportHasCompetitions() {
        var repository = mock(SportRepository.class);
        var sport = new Sport("Football", null);
        sport.getCompetitions().add(new es.codeurjc.betsphere.model.Competition());
        when(repository.findById(12L)).thenReturn(java.util.Optional.of(sport));

        org.assertj.core.api.Assertions.assertThatThrownBy(() -> new SportService(repository).delete(12L))
                .isInstanceOf(IllegalStateException.class);
        org.mockito.Mockito.verify(repository, org.mockito.Mockito.never()).delete(sport);
    }
}

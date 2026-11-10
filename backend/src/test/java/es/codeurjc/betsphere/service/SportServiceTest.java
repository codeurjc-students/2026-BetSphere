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
}

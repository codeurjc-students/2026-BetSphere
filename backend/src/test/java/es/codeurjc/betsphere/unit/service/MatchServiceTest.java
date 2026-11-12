package es.codeurjc.betsphere.unit.service;

import es.codeurjc.betsphere.service.MatchService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import es.codeurjc.betsphere.model.Match;
import es.codeurjc.betsphere.repository.MatchRepository;

// Say to JUnit that we are going to isolate this with Mockito, without Spring
@ExtendWith(MockitoExtension.class)
public class MatchServiceTest {
    
    @Mock //we create a fake repository with Mock
    private MatchRepository matchRepository;

    @InjectMocks
    private MatchService matchService;

    @Test
    void testGetMatches() {
        // Arrange (Setup the mock behavior)
        Match match1 = new Match("Real Madrid", "Barcelona", LocalDateTime.now(), 2.10, 3.40, 3.20, "SCHEDULED");
        Match match2 = new Match("Manchester City", "Arsenal", LocalDateTime.now(), 1.80, 3.50, 4.20, "SCHEDULED");
        List<Match> mockMatches = Arrays.asList(match1, match2);

        when(matchRepository.findAll()).thenReturn(mockMatches);

        List<Match> result = matchService.getAllMatches();

        // Assert (Verify the output)
        assertNotNull(result, "The returned list should not be null");
        assertEquals(2, result.size(), "The list should contain exactly 2 matches");
        assertEquals("Real Madrid", result.get(0).getHomeTeam(), "First match home team should match");
        assertEquals("Arsenal", result.get(1).getAwayTeam(), "Second match away team should match");

        // Verify the repository was called exactly once
        verify(matchRepository, times(1)).findAll();
    }

    @Test
    void preservesTheRequestedSecondPageAndItsMetadata() {
        var request = PageRequest.of(1, 1);
        var match = new Match("Arsenal", "Everton", LocalDateTime.now(), 2.0, 3.0, 4.0, "SCHEDULED");
        when(matchRepository.findAll(request)).thenReturn(
                new PageImpl<>(List.of(match), request, 2));

        var page = matchService.getAllMatches(request);

        assertEquals(List.of(match), page.getContent());
        assertEquals(1, page.getNumber());
        assertEquals(2, page.getTotalElements());
        verify(matchRepository).findAll(request);
    }

    @Test
    void rejectsAnUnknownMatch() {
        when(matchRepository.findById(99L)).thenReturn(Optional.empty());

        Assertions.assertThatThrownBy(() -> matchService.getMatch(99L))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Match not found");
    }

    @Test
    void rejectsMatchWithMissingRelationshipIds() {
        var match = new Match("Real Madrid", "Barcelona", LocalDateTime.now(), 2.0, 3.0, 4.0, "SCHEDULED");

        Assertions.assertThatThrownBy(() -> matchService.create(match))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Home team, away team and competition IDs are required.");
        verify(matchRepository, Mockito.never()).save(match);
    }
}

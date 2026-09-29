package es.codeurjc.betsphere.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import es.codeurjc.betsphere.dto.MatchDTO;
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
}

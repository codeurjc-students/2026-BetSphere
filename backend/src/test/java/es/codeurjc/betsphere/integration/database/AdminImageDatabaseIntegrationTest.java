package es.codeurjc.betsphere.integration.database;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import es.codeurjc.betsphere.controller.CompetitionRestController;
import es.codeurjc.betsphere.controller.SportRestController;
import es.codeurjc.betsphere.controller.TeamRestController;
import es.codeurjc.betsphere.repository.CompetitionRepository;
import es.codeurjc.betsphere.repository.SportRepository;
import es.codeurjc.betsphere.repository.TeamRepository;
import es.codeurjc.betsphere.service.ImageStorageService;
import es.codeurjc.betsphere.support.MysqlTestConfiguration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@Import(MysqlTestConfiguration.class)
class AdminImageDatabaseIntegrationTest {

    private static final String IMAGE_KEY = "ab4e2e24-2591-4015-a82f-f16db457d44b";
    private static final String IMAGE_URL = "/api/v1/images/" + IMAGE_KEY;
    private final MockMultipartFile image = new MockMultipartFile("file", "logo.png", "image/png", new byte[] {1});

    @MockitoBean
    private ImageStorageService storage;

    @Autowired
    private SportRestController sportController;

    @Autowired
    private CompetitionRestController competitionController;

    @Autowired
    private TeamRestController teamController;

    @Autowired
    private SportRepository sports;

    @Autowired
    private CompetitionRepository competitions;

    @Autowired
    private TeamRepository teams;

    @BeforeEach
    void configureStorage() throws Exception {
        when(storage.store(image)).thenReturn(IMAGE_KEY);
        when(storage.publicUrl(IMAGE_KEY)).thenReturn(IMAGE_URL);
    }

    @Test
    void savesSportImageUrlInMysql() throws Exception {
        long id = sports.findByName("Football").orElseThrow().getId();

        assertThat(sportController.uploadSportImage(id, image).getStatusCode().value()).isEqualTo(200);

        assertThat(sports.findById(id).orElseThrow().getIconUrl()).isEqualTo(IMAGE_URL);
    }

    @Test
    void savesCompetitionImageUrlInMysql() throws Exception {
        long id = competitions.findAll().stream().filter(competition -> "La Liga".equals(competition.getName()))
                .findFirst().orElseThrow().getId();

        assertThat(competitionController.uploadCompetitionImage(id, image).getStatusCode().value()).isEqualTo(200);

        assertThat(competitions.findById(id).orElseThrow().getIconUrl()).isEqualTo(IMAGE_URL);
    }

    @Test
    void savesTeamImageUrlInMysql() throws Exception {
        long id = teams.findByName("Barcelona").orElseThrow().getId();

        assertThat(teamController.uploadTeamImage(id, image).getStatusCode().value()).isEqualTo(200);

        assertThat(teams.findById(id).orElseThrow().getLogoUrl()).isEqualTo(IMAGE_URL);
    }
}

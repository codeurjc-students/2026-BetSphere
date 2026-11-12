package es.codeurjc.betsphere.unit.service;

import es.codeurjc.betsphere.service.ImageStorageService;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

class ImageStorageServiceTest {

    @Test
    void rejectsUnsupportedFilesBeforeContactingStorage() {
        var storage = mock(S3Client.class);
        var service = new ImageStorageService(storage, "test-images");
        var file = new MockMultipartFile("file", "avatar.txt", "text/plain", new byte[] {1});

        assertThatThrownBy(() -> service.store(file)).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Only JPEG, PNG, WebP, or GIF images are allowed.");
        verifyNoInteractions(storage);
    }
}

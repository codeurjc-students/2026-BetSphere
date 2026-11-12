package es.codeurjc.betsphere.unit.service;

import es.codeurjc.betsphere.service.ImageStorageService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockMultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

class ImageStorageServiceTest {

    @Test
    void storesImageBytesAndMimeTypeUnderTheKeyUsedByThePublicUrl() throws Exception {
        var storage = mock(S3Client.class);
        var service = new ImageStorageService(storage, "test-images");
        byte[] bytes = {1, 2, 3};
        var file = new MockMultipartFile("file", "logo.png", "image/png", bytes);

        String key = service.store(file);

        var body = ArgumentCaptor.forClass(RequestBody.class);
        var request = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(storage).putObject(request.capture(), body.capture());
        assertThat(request.getValue().bucket()).isEqualTo("test-images");
        assertThat(request.getValue().contentType()).isEqualTo("image/png");
        assertThat(request.getValue().key()).isEqualTo(key);
        try (var stream = body.getValue().contentStreamProvider().newStream()) {
            assertThat(stream.readAllBytes()).containsExactly(bytes);
        }
        assertThat(service.keyFromUrl(service.publicUrl(key))).isEqualTo(key);
    }

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

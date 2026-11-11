package es.codeurjc.betsphere;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.utility.DockerImageName;

public final class MinioTestStorage {

    private static final int PORT = 9000;
    private static final String ACCESS_KEY = "betsphere-test";
    private static final String SECRET_KEY = "betsphere-test-secret";

    private MinioTestStorage() {}

    public static GenericContainer<?> container() {
        return new GenericContainer<>(DockerImageName.parse("pgsty/silo:RELEASE.2026-10-26T00-00-00Z"))
                .withEnv("MINIO_ROOT_USER", ACCESS_KEY)
                .withEnv("MINIO_ROOT_PASSWORD", SECRET_KEY)
                .withCommand("server", "/data")
                .withExposedPorts(PORT)
                .waitingFor(Wait.forHttp("/minio/health/live").forPort(PORT));
    }

    public static void configure(DynamicPropertyRegistry registry, GenericContainer<?> container) {
        registry.add("storage.s3.endpoint", () -> "http://" + container.getHost() + ":" + container.getMappedPort(PORT));
        registry.add("storage.s3.access-key", () -> ACCESS_KEY);
        registry.add("storage.s3.secret-key", () -> SECRET_KEY);
        registry.add("storage.s3.bucket", () -> "betsphere-test-avatars");
        registry.add("storage.s3.region", () -> "us-east-1");
        registry.add("storage.s3.path-style-access", () -> true);
    }
}

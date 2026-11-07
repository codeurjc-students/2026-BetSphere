package es.codeurjc.betsphere.security.jwt;

import java.time.Duration;

public enum TokenType {
    ACCESS(Duration.ofMinutes(15)),
    REFRESH(Duration.ofDays(7));

    public static final String REFRESH_COOKIE_NAME = "RefreshToken";
    public final Duration duration;

    TokenType(Duration duration) {
        this.duration = duration;
    }
}

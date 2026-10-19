package es.codeurjc.betsphere.security.jwt;

import java.time.Duration;

public enum TokenType {
    ACCESS("access_token", Duration.ofMinutes(15)),
    REFRESH("refresh_token", Duration.ofDays(7));

    public final String cookieName;
    public final Duration duration;

    TokenType(String cookieName, Duration duration) {
        this.cookieName = cookieName;
        this.duration = duration;
    }
}

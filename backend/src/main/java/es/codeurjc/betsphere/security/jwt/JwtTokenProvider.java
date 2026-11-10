package es.codeurjc.betsphere.security.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    private final SecretKey jwtSecret;
    private final JwtParser jwtParser;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretString) {
        this.jwtSecret = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
        this.jwtParser = Jwts.parser().verifyWith(jwtSecret).build();
    }

    public Claims validateToken(String token) {
        return jwtParser.parseSignedClaims(token).getPayload();
    }

    public String generateAccessToken(UserDetails userDetails) {
        return buildToken(TokenType.ACCESS, userDetails).compact();
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(TokenType.REFRESH, userDetails).compact();
    }

    private JwtBuilder buildToken(TokenType tokenType, UserDetails userDetails) {
        var currentDate = new Date();
        var expiryDate = Date.from(new Date().toInstant().plus(tokenType.duration));
        
        return Jwts.builder()
                .claim("roles", userDetails.getAuthorities())
                .claim("type", tokenType.name())
                .subject(userDetails.getUsername())
                .issuedAt(currentDate)
                .expiration(expiryDate)
                .signWith(jwtSecret);
    }
}

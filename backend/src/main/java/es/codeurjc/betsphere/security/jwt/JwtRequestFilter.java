package es.codeurjc.betsphere.security.jwt;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import es.codeurjc.betsphere.security.RepositoryUserDetailsService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component 
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtRequestFilter.class);

    private final JwtTokenProvider tokenProvider;
    private final RepositoryUserDetailsService userDetailsService;

    public JwtRequestFilter(JwtTokenProvider tokenProvider, RepositoryUserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // Try to validate JWT token from HTTP headers
            Claims claims = tokenProvider.validateToken(request, false);
            String username = claims.getSubject();
            String tokenType = claims.get("type", String.class);

            // validate ACCESS_TOKEN to give permissions
            if (username != null && TokenType.ACCESS.name().equals(tokenType)) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            if (ex.getMessage() == null || !ex.getMessage().equals("No access token cookie found in request")) {
                log.error("Exception processing JWT Token: ", ex);
            }
        }

        filterChain.doFilter(request, response);
    }
}
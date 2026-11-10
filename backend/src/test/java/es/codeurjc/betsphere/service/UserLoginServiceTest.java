package es.codeurjc.betsphere.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;

import es.codeurjc.betsphere.security.RepositoryUserDetailsService;
import es.codeurjc.betsphere.security.jwt.JwtTokenProvider;
import es.codeurjc.betsphere.security.jwt.LoginRequest;
import es.codeurjc.betsphere.security.jwt.UserLoginService;

class UserLoginServiceTest {

    @Test
    void rejectedCredentialsDoNotIssueTokensOrCookies() {
        var authenticationManager = mock(AuthenticationManager.class);
        var tokenProvider = mock(JwtTokenProvider.class);
        var service = new UserLoginService(authenticationManager, tokenProvider,
                mock(RepositoryUserDetailsService.class));
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Invalid password"));
        var response = new MockHttpServletResponse();

        var result = service.login(new MockHttpServletRequest(), response,
                new LoginRequest("user@example.test", "incorrect"));

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getCookies()).isEmpty();
        verifyNoInteractions(tokenProvider);
    }

    @Test
    void missingRefreshCookieReturnsBadRequestWithoutCheckingToken() {
        var tokenProvider = mock(JwtTokenProvider.class);
        var service = new UserLoginService(mock(AuthenticationManager.class), tokenProvider,
                mock(RepositoryUserDetailsService.class));

        var result = service.refresh(new MockHttpServletRequest(), new MockHttpServletResponse(), null);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        verifyNoInteractions(tokenProvider);
    }
}

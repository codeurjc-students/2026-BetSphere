package es.codeurjc.betsphere.integration.database;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import es.codeurjc.betsphere.repository.UserRepository;
import es.codeurjc.betsphere.security.jwt.JwtTokenProvider;
import es.codeurjc.betsphere.security.jwt.UserLoginService;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import es.codeurjc.betsphere.dto.UserRegisterDTO;
import es.codeurjc.betsphere.model.User;
import es.codeurjc.betsphere.service.UserService;
import org.springframework.context.annotation.Import;
import es.codeurjc.betsphere.support.MysqlTestConfiguration;

@SpringBootTest
@Import(MysqlTestConfiguration.class)
class AccountDatabaseIntegrationTest {

    private static final String EMAIL = "user@betsphere.com";
    private static final String PASSWORD = "user123";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserLoginService loginService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void authenticationManagerVerifiesPasswordAgainstMysql() {
        var authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(EMAIL, PASSWORD));

        assertThat(authentication.isAuthenticated()).isTrue();
        assertThat(authentication.getName()).isEqualTo(EMAIL);
    }

    @Test
    void refreshResolvesPersistedUser() {
        var persistedUser = userRepository.findByEmail(EMAIL).orElseThrow();
        String refreshToken = tokenProvider.generateRefreshToken(persistedUser);

        var result = loginService.refresh(null, null, refreshToken);

        assertThat(result.getStatusCode().value()).isEqualTo(200);
        assertThat(tokenProvider.validateToken(result.getBody().getAccessToken()).getSubject())
                .isEqualTo(EMAIL);
    }

    @Test
    void pagedUserServiceLoadsSeededAccountsFromMysql() {
        var page = userService.getAllUsers(org.springframework.data.domain.PageRequest.of(0, 10));
        assertThat(page.getContent()).extracting(es.codeurjc.betsphere.model.User::getEmail)
                .contains(EMAIL, "admin@betsphere.com");
    }

    @Test
    void persistsAdultWithEncodedPasswordInMysql() {
        var adult = registration(18);
        userService.register(new User(adult.username(), adult.email(), adult.password(),
                java.util.List.of(), adult.birthDate()));

        var saved = userRepository.findByEmail(adult.email()).orElseThrow();
        assertThat(saved.getBirthDate()).isEqualTo(adult.birthDate());
        assertThat(saved.getPassword()).isNotEqualTo(adult.password());
        assertThat(passwordEncoder.matches(adult.password(), saved.getPassword())).isTrue();
    }

    private UserRegisterDTO registration(int age) {
        String username = "user_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        return new UserRegisterDTO(username, username + "@example.test", "ValidPass1!",
                LocalDate.now().minusYears(age));
    }
}

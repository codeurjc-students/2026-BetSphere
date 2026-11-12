package es.codeurjc.betsphere.unit.service;

import es.codeurjc.betsphere.service.UserService;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import es.codeurjc.betsphere.model.User;
import es.codeurjc.betsphere.repository.UserRepository;

class UserRegistrationTest {

    @Test
    void rejectsUserBeforeEighteenthBirthdayWithoutSaving() {
        var users = mock(UserRepository.class);
        var encoder = mock(PasswordEncoder.class);
        var service = new UserService(users, encoder);
        var minor = new User("test_user", "user@example.test", "ValidPass1!",
                List.of(), LocalDate.now().minusYears(18).plusDays(1));

        assertThatThrownBy(() -> service.register(minor))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User must be 18 or older.");
        verify(users, never()).save(any());
        verifyNoInteractions(encoder);
    }
}

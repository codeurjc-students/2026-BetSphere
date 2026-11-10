package es.codeurjc.betsphere.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import es.codeurjc.betsphere.model.User;
import es.codeurjc.betsphere.repository.UserRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

class AdminUserServiceTest {

    @Test
    void returnsTheRequestedUserPage() {
        var users = mock(UserRepository.class);
        var service = new UserService(users, mock(PasswordEncoder.class));
        var request = PageRequest.of(1, 1);
        var expected = new PageImpl<>(List.of(new User()), request, 2);
        when(users.findAll(request)).thenReturn(expected);

        assertThat(service.getAllUsers(request)).isEqualTo(expected);
    }
}

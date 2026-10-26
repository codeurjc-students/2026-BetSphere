package es.codeurjc.betsphere.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import es.codeurjc.betsphere.model.User;
import es.codeurjc.betsphere.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow();
    }


    public User register(User user) {
        // Username
        if (user.getRealUsername() == null || user.getRealUsername().trim().isEmpty()) {
            throw new RuntimeException("Username cannot be null or empty.");
        }
        if (user.getRealUsername().length() < 3 || user.getRealUsername().length() > 30) {
            throw new RuntimeException("Username must be between 3 and 30 characters.");
        }
        if (!user.getRealUsername().matches("^[a-zA-Z0-9_]+$")) {
            throw new RuntimeException("Username can only contain letters, numbers and underscores.");
        }
        if (userRepository.findByUsername(user.getRealUsername()).isPresent()) {
            throw new RuntimeException("Username '" + user.getRealUsername() + "' is already taken.");
        }

        // Email
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be null or empty.");
        }
        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format.");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email '" + user.getEmail() + "' is already registered.");
        }

        // Password
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be null or empty.");
        }
        if (user.getPassword().length() < 8 || user.getPassword().length() > 64) {
            throw new RuntimeException("Password must be between 8 and 64 characters long.");
        }
        if (user.getPassword().matches(".*\\s.*")) {
            throw new RuntimeException("Password cannot contain whitespace.");
        }
        if (!user.getPassword().matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#_\\-]).{8,64}$")) {
            throw new RuntimeException("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }

        // Age
        if (user.getBirthDate() == null) {
            throw new RuntimeException("Birth date is required.");
        }
        int age = Period.between(user.getBirthDate(), LocalDate.now()).getYears();
        if (age < 18) {
            throw new RuntimeException("User must be 18 or older.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(List.of("ROLE_REGISTERED"));
        user.setVerified18(true);
        user.setVirtualBalance(0.0);

        return userRepository.save(user);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public User update(Long id, User partialUser) {
        User existingUser = getUser(id);

        if (partialUser.getRealUsername() != null && !partialUser.getRealUsername().isBlank()) {
            if (partialUser.getRealUsername().length() < 3 || partialUser.getRealUsername().length() > 30) {
                throw new RuntimeException("Username must be between 3 and 30 characters.");
            }
            if (!existingUser.getRealUsername().equals(partialUser.getRealUsername()) && userRepository.findByUsername(partialUser.getRealUsername()).isPresent()) {
                throw new RuntimeException("Username is already taken.");
            }
            existingUser.setUsername(partialUser.getRealUsername());
        }

        if (partialUser.getPassword() != null && !partialUser.getPassword().isBlank()) {
            if (partialUser.getPassword().length() < 8 || partialUser.getPassword().length() > 64) {
                throw new RuntimeException("Password must be between 8 and 64 characters long.");
            }
            existingUser.setPassword(passwordEncoder.encode(partialUser.getPassword()));
        }

        if (partialUser.getBirthDate() != null) {
            int age = Period.between(partialUser.getBirthDate(), LocalDate.now()).getYears();
            if (age < 18) {
                throw new RuntimeException("User must be 18 or older.");
            }
            existingUser.setBirthDate(partialUser.getBirthDate());
        }

        return userRepository.save(existingUser);
    }

    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
}

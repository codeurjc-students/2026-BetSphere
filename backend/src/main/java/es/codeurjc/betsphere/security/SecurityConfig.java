package es.codeurjc.betsphere.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import es.codeurjc.betsphere.security.jwt.JwtRequestFilter;

@Configuration 
@EnableWebSecurity 
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }
    
    @Bean
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            // Don't save sessions
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .authorizeHttpRequests(auth -> auth
                //PUBLIC
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/matches/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/users/").permitAll()       
                .requestMatchers(HttpMethod.GET, "/api/v1/sports/**").permitAll() 
                .requestMatchers(HttpMethod.GET, "/api/v1/competitions/**").permitAll() 
                .requestMatchers(HttpMethod.GET, "/api/v1/teams/**").permitAll()
                //PRIVATE
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/sports/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/sports/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/sports/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/competitions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/competitions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/competitions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/teams/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/teams/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/teams/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/matches/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/matches/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/matches/**").hasRole("ADMIN")
                //AUTHENTICATED
                .requestMatchers("/api/v1/users/**").authenticated()
                
                .anyRequest().authenticated()
            );

        // JWT filter
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}

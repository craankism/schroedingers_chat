package sc.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import sc.backend.components.JwtAuthFilter;

import static org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher.withDefaults;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) {
        var paths = withDefaults();

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .headers(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(paths.matcher("/api/auth/**")).permitAll()
                        .requestMatchers(paths.matcher("/api/admin/**")).hasRole("ADMIN")
                        .requestMatchers(paths.matcher("/h2/**")).permitAll() //Test
                        .requestMatchers(paths.matcher("/ws"), paths.matcher("/ws/**")).permitAll()
                        .requestMatchers(paths.matcher("/api/file/**")).permitAll() //TEST
                        .requestMatchers(paths.matcher("/actuator/health")).permitAll()
                        .requestMatchers(paths.matcher("/error")).permitAll()
                        .anyRequest().authenticated()
                        //TODO: change permissions
                )
                .build();
    }
}
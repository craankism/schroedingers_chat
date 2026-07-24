package sc.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
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
//                .headers(AbstractHttpConfigurer::disable)
                //TODO den Block hier drunter testen, sollte weit sicherer sein als der Alte
                .headers(headers -> headers
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                        .contentTypeOptions(content -> {})
                        .xssProtection(xss -> {})
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            response.getWriter().write(
                                    "{\"status\":401,\"error\":\"UNAUTHORIZED\",\"message\":\"Authentication required\"}"
                            );
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType("application/json");
                            response.getWriter().write(
                                    "{\"status\":403,\"error\":\"ACCESS_DENIED\",\"message\":\"Access denied\"}"
                            );
                        })
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(paths.matcher("/api/auth/**")).permitAll()
                        .requestMatchers(paths.matcher("/api/admin/**")).hasRole("ADMIN")
                        .requestMatchers(paths.matcher("/h2/**")).permitAll() //TODO: remove before production
                        .requestMatchers(paths.matcher("/ws"), paths.matcher("/ws/**")).permitAll()
                        .requestMatchers(paths.matcher("/api/file/**")).authenticated()
                        .requestMatchers(paths.matcher("/actuator/health")).permitAll()
                        .requestMatchers(paths.matcher("/error")).permitAll()
                        .requestMatchers(paths.matcher("/swagger-ui/**"), paths.matcher("/swagger-ui.html")).permitAll()
                        .requestMatchers(paths.matcher("/v3/api-docs/**"), paths.matcher("/v3/api-docs")).permitAll()
                        .anyRequest().authenticated()
                        //TODO: change permissions
                )
                .build();
    }
}
package com.example.AIResumeScreeneer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.AIResumeScreeneer.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // CORS
            .cors(cors -> {})

            // Disable CSRF because JWT is being used
            .csrf(csrf -> csrf.disable())

            // Stateless authentication
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // Authentication APIs
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // Resume viewing
                .requestMatchers(
                    "/api/resume/view/**"
                ).permitAll()

                // ADMIN ONLY
                .requestMatchers(
                    "/api/admin/**",
                    "/api/user/all"
                ).hasRole("ADMIN")

                // ADMIN + USER
                .requestMatchers(
                    "/api/resume/**"
                ).hasAnyRole("ADMIN", "USER")

                // Everything else
                .anyRequest()
                .authenticated()
            )

            // JWT filter
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
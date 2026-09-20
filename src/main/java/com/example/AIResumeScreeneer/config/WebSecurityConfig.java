package com.example.AIResumeScreeneer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

            // =========================================================
            // CORS
            // =========================================================
            .cors(cors -> {})

            // =========================================================
            // CSRF
            // =========================================================
            .csrf(csrf -> csrf.disable())

            // =========================================================
            // STATELESS JWT
            // =========================================================
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // =========================================================
            // AUTHORIZATION
            // =========================================================
            .authorizeHttpRequests(auth -> auth

                // Preflight requests
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // =====================================================
                // AUTH
                // =====================================================
                .requestMatchers(
    "/api/auth/register",
    "/api/auth/login"
).permitAll()
                // =====================================================
                // WEBSOCKET
                // =====================================================
                .requestMatchers(
                    "/ws",
                    "/ws/**"
                ).permitAll()

                // =====================================================
                // PUBLIC RESUME VIEW
                // =====================================================
                .requestMatchers(
                    "/api/resume/view/**"
                ).permitAll()

                // =====================================================
                // NOTIFICATIONS
                // ADMIN + USER
                // =====================================================
                .requestMatchers(
                    "/api/notifications/**"
                ).hasAnyRole("ADMIN", "USER")

                // =====================================================
                // USER PROFILE
                // ADMIN + USER
                // =====================================================
                .requestMatchers(
                    "/api/user/profile",
                    "/api/user/change-password"
                ).hasAnyRole("ADMIN", "USER")

                // =====================================================
                // ALL USERS
                // ADMIN ONLY
                // =====================================================
                .requestMatchers(
                    "/api/user/all"
                ).hasRole("ADMIN")


                .requestMatchers(
    HttpMethod.GET,
    "/api/resume/my"
).hasRole("USER")

.requestMatchers(
    HttpMethod.POST,
    "/api/resume/my-upload"
).hasRole("USER")

.requestMatchers(
    HttpMethod.DELETE,
    "/api/resume/my/**"
).hasRole("USER")

                // =====================================================
                // RESUME APIs
                // ADMIN + USER
                // =====================================================
                .requestMatchers(
                    "/api/resume/**"
                ).hasAnyRole("ADMIN", "USER")

                // =====================================================
                // ADMIN APIs
                // =====================================================
                .requestMatchers(
                    "/api/admin/**"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/api/jobs")
    .hasRole("ADMIN")

.requestMatchers(HttpMethod.PUT, "/api/jobs/**")
    .hasRole("ADMIN")

.requestMatchers(HttpMethod.DELETE, "/api/jobs/**")
    .hasRole("ADMIN")

.requestMatchers(HttpMethod.GET, "/api/jobs/all")
    .hasRole("ADMIN")

.requestMatchers(HttpMethod.GET, "/api/jobs", "/api/jobs/**")
    .hasAnyRole("ADMIN", "USER")

    .requestMatchers(HttpMethod.POST, "/api/applications")
    .hasRole("USER")

.requestMatchers(HttpMethod.GET, "/api/applications/my")
    .hasRole("USER")

.requestMatchers(HttpMethod.GET, "/api/applications/job/**")
    .hasRole("ADMIN")

                // =====================================================
                // EVERYTHING ELSE
                // =====================================================
                .anyRequest().authenticated()
            )

            // =========================================================
            // JWT FILTER
            // =========================================================
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
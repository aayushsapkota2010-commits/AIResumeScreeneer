package com.example.AIResumeScreeneer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.AIResumeScreeneer.security.GoogleOAuth2SuccessHandler;
import com.example.AIResumeScreeneer.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import org.springframework.security.config.Customizer;

@Configuration
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})

            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.IF_REQUIRED
                )
            )

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login"
                ).permitAll()

                .requestMatchers(
                    "/oauth2/**",
                    "/login/oauth2/**"
                ).permitAll()

                .requestMatchers(
                    "/ws",
                    "/ws/**"
                ).permitAll()

                .requestMatchers(
                    "/api/resume/view/**"
                ).permitAll()

                .requestMatchers(
    "/api/notifications/**"
).hasAnyRole("ADMIN", "USER")

.requestMatchers(
    HttpMethod.PUT,
    "/api/interview/complete/**",
    "/api/interview/cancel/**",
    "/api/interview/update/**"
).hasRole("ADMIN")

                .requestMatchers(
                    "/api/user/profile",
                    "/api/user/change-password"
                ).hasAnyRole("ADMIN", "USER")

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

                .requestMatchers(
                    "/api/resume/**"
                ).hasAnyRole("ADMIN", "USER")

                .requestMatchers(
                    "/api/admin/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/jobs"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/jobs/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/jobs/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/jobs/all"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/jobs",
                    "/api/jobs/**"
                ).hasAnyRole("ADMIN", "USER")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/applications"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/applications/my"
                ).hasRole("USER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/applications/job/**"
                ).hasRole("ADMIN")

                .anyRequest().authenticated()
            )

          .oauth2Login(oauth2 -> oauth2
    .successHandler(googleOAuth2SuccessHandler)
)

.addFilterBefore(
    jwtAuthenticationFilter,
    UsernamePasswordAuthenticationFilter.class
);

        return http.build();
    }
}   
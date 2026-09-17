package com.example.AIResumeScreeneer.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // ============================================================
        // Allowed frontend origins
        // ============================================================

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:5174"
                )
        );

        // ============================================================
        // Allowed HTTP methods
        // ============================================================

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        // ============================================================
        // Allowed headers
        // ============================================================

        configuration.setAllowedHeaders(
                List.of("*")
        );

        // ============================================================
        // Allow cookies / credentials
        // ============================================================

        configuration.setAllowCredentials(true);

        // ============================================================
        // Apply CORS configuration to all endpoints
        // ============================================================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}
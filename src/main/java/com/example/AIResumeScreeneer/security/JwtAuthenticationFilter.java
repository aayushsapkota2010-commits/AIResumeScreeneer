package com.example.AIResumeScreeneer.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("=================================");
System.out.println(
        "REQUEST = "
        + request.getMethod()
        + " "
        + request.getRequestURI()
);
        System.out.println("AUTH HEADER = " + authHeader);

        // No token
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println("NO JWT TOKEN FOUND");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        System.out.println("TOKEN RECEIVED");

        try {

            // Validate token first
            if (!jwtService.validateToken(token)) {

                System.out.println("TOKEN INVALID");

                filterChain.doFilter(request, response);
                return;
            }

            System.out.println("TOKEN VALID");

            String email = jwtService.extractEmail(token);

            String role = jwtService.extractRole(token);

            System.out.println("EMAIL = " + email);
            System.out.println("ROLE FROM TOKEN = " + role);

            /*
             * Make sure role is not null
             */
            if (role == null || role.isBlank()) {

                System.out.println("ROLE IS NULL OR EMPTY");

                filterChain.doFilter(request, response);
                return;
            }

            /*
             * Normalize role.
             *
             * If role = ADMIN
             * -> ROLE_ADMIN
             *
             * If role = ROLE_ADMIN
             * -> ROLE_ADMIN
             */
            String authorityRole = role.startsWith("ROLE_")
                    ? role
                    : "ROLE_" + role;

            System.out.println(
                    "AUTHORITY = " + authorityRole
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            authorityRole
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "AUTHENTICATION SET = "
                    + SecurityContextHolder
                    .getContext()
                            .getAuthentication()
            );

            System.out.println(
                    "AUTHORITIES = "
                    + SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            .getAuthorities()
            );

        } catch (Exception e) {

            System.out.println("JWT PROCESSING ERROR");

            e.printStackTrace();

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);

        System.out.println("=================================");
    }
}
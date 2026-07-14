package com.example.AIResumeScreeneer.security;


import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import java.util.Collections;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

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

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token =
                authHeader.substring(7);

        System.out.println("TOKEN RECEIVED = " + token);
        System.out.println(
    "ROLE FROM TOKEN = " +
    jwtService.extractRole(token)
);

if (jwtService.validateToken(token)) {

    System.out.println("TOKEN VALID");

    String email =
            jwtService.extractEmail(token);

    System.out.println("EMAIL = " + email);
    String role =
        jwtService.extractRole(token);

    UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                   List.of(
        new SimpleGrantedAuthority(
                "ROLE_" + role
        )
));

    SecurityContextHolder.getContext()
            .setAuthentication(authentication);

    System.out.println(
            "AUTH SET = " +
            SecurityContextHolder.getContext()
                    .getAuthentication()
    );

} else {

    System.out.println("TOKEN INVALID");
}
System.out.println("Request URI = "
        + request.getRequestURI());
        System.out.println("Authorization Header = "
        + request.getHeader("Authorization"));
        filterChain.doFilter(request, response);
    }
}
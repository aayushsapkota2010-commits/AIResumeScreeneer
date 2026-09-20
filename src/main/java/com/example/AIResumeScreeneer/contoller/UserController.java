package com.example.AIResumeScreeneer.contoller;

import com.example.AIResumeScreeneer.dto.ChangePasswordRequest;
import com.example.AIResumeScreeneer.dto.UpdateProfileRequest;
import com.example.AIResumeScreeneer.dto.UserProfileResponse;
import com.example.AIResumeScreeneer.entity.User;
import com.example.AIResumeScreeneer.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    // ==============================
    // GET LOGGED-IN USER PROFILE
    // ==============================

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        UserProfileResponse response =
                new UserProfileResponse(
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole()
                );

        return ResponseEntity.ok(response);
    }


    // ==============================
    // UPDATE LOGGED-IN USER PROFILE
    // ==============================

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (request.getFullName() != null &&
                !request.getFullName().trim().isEmpty()) {

            user.setFullName(
                    request.getFullName().trim()
            );
        }

        User updatedUser =
                userRepository.save(user);

        UserProfileResponse response =
                new UserProfileResponse(
                        updatedUser.getFullName(),
                        updatedUser.getEmail(),
                        updatedUser.getRole()
                );

        return ResponseEntity.ok(response);
    }


    // ==============================
    // CHANGE PASSWORD
    // ==============================

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // Check current password

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            return ResponseEntity
                    .badRequest()
                    .body("Current password is incorrect.");
        }


        // Validate new password

        if (request.getNewPassword() == null ||
                request.getNewPassword().length() < 6) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "New password must contain at least 6 characters."
                    );
        }


        // Encrypt new password

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );


        userRepository.save(user);


        return ResponseEntity.ok(
                "Password changed successfully."
        );
    }
}
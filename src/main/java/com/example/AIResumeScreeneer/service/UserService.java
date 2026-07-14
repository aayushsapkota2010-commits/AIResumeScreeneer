package com.example.AIResumeScreeneer.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.LoginRequest;
import com.example.AIResumeScreeneer.dto.RegisterRequest;
import com.example.AIResumeScreeneer.dto.UserResponse;
import com.example.AIResumeScreeneer.entity.User;
import com.example.AIResumeScreeneer.repository.UserRepository;
import com.example.AIResumeScreeneer.security.JwtService;

import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
        private final BCryptPasswordEncoder passwordEncoder;
        
        public String register(RegisterRequest request)
        {
            if(userRepository.findByEmail(request.getEmail()).isPresent())
            {
                return "User Already Exists";
            }
            User user=User.builder().fullName(request.getFullName()).email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role("USER").build();
            userRepository.save(user);
            return "Registration Successfull";
        
        }

        public String login(LoginRequest request) {

    User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    boolean matches =
            passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword());

    if (!matches) {
        throw new RuntimeException("Invalid Password");
    }

    return jwtService.generateToken(user.getEmail(),user.getRole());
}
public List<UserResponse> getAllUsers() {

    return userRepository.findAll()
            .stream()
            .map(user -> UserResponse.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build())
            .toList();
}
public String updateRole(
        Long userId,
        String role) {

    User user =
            userRepository.findById(userId)
                    .orElseThrow();

    user.setRole(role);

    userRepository.save(user);

    return "Role Updated";
}
    
}

package com.example.AIResumeScreeneer.config;

import com.example.AIResumeScreeneer.entity.User;
import com.example.AIResumeScreeneer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "aayush.sapkota2010@gmail.com";
        
        User admin = userRepository.findByEmail(adminEmail).orElse(new User());
        admin.setEmail(adminEmail);
        admin.setFullName("Aayush Admin");
        admin.setRole("ADMIN");
        // Set your desired admin password here
        admin.setPassword(passwordEncoder.encode("admin123")); 
        
        userRepository.save(admin);
        System.out.println("Admin user seeded successfully with password!");
    }
}
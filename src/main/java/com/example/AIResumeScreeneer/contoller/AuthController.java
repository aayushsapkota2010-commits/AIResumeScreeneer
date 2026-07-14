package com.example.AIResumeScreeneer.contoller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.AIResumeScreeneer.dto.LoginRequest;
import com.example.AIResumeScreeneer.dto.RegisterRequest;
import com.example.AIResumeScreeneer.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;


    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {        
        return userService.register(request);
    }
    @PostMapping("/login")
public String login( @RequestBody LoginRequest request) {

    return userService.login(request);
}

@GetMapping("/profile")
public String profile() {
    return "Protected API Working";
}

}

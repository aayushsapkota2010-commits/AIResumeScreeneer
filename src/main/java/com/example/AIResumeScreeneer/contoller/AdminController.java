package com.example.AIResumeScreeneer.contoller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.AIResumeScreeneer.dto.RoleUpdateRequest;
import com.example.AIResumeScreeneer.dto.UserResponse;
import com.example.AIResumeScreeneer.service.UserService;

import lombok.RequiredArgsConstructor;
import java.util.List;


@RestController
 @RequiredArgsConstructor

public class AdminController {
    private final UserService userService;

    @GetMapping("/api/admin/test")
    public String adminTest() {

        return "Admin Access Granted";
    }
    @GetMapping("/api/admin/users")
public List<UserResponse> getUsers() {

    return userService.getAllUsers();
}

@PutMapping("/api/admin/users/{id}/role")
public String updateRole(
        @PathVariable Long id,
        @RequestBody RoleUpdateRequest request) {

    return userService.updateRole(
            id,
            request.getRole()
    );
}

}
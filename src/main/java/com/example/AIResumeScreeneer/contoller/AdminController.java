package com.example.AIResumeScreeneer.contoller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.AIResumeScreeneer.dto.RoleUpdateRequest;
import com.example.AIResumeScreeneer.dto.UserResponse;
import com.example.AIResumeScreeneer.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {
                org.springframework.web.bind.annotation.RequestMethod.GET,
                org.springframework.web.bind.annotation.RequestMethod.PUT,
                org.springframework.web.bind.annotation.RequestMethod.OPTIONS
        }
)
public class AdminController {

    private final UserService userService;


    // ==============================
    // ADMIN TEST
    // ==============================

    @GetMapping("/api/admin/test")
    public String adminTest() {

        return "Admin Access Granted";
    }


    // ==============================
    // GET ALL USERS
    // ==============================

    @GetMapping("/api/admin/users")
    public List<UserResponse> getUsers() {

        return userService.getAllUsers();
    }


    // ==============================
    // UPDATE USER ROLE
    // ==============================

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
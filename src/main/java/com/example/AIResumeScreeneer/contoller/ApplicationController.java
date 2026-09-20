package com.example.AIResumeScreeneer.contoller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.AIResumeScreeneer.entity.Application;
import com.example.AIResumeScreeneer.service.ApplicationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // USER: Apply for a job
    @PostMapping
    public ResponseEntity<?> apply(
            @RequestParam Long jobId,
            @RequestParam Long resumeId,
            Principal principal) {

        try {

            String candidateEmail = principal.getName();

            Application application =
                    applicationService.apply(
                            jobId,
                            resumeId,
                            candidateEmail
                    );

            return ResponseEntity.ok(application);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // USER: Get my applications
    @GetMapping("/my")
    public ResponseEntity<List<Application>> getMyApplications(
            Principal principal) {

        String candidateEmail = principal.getName();

        return ResponseEntity.ok(
                applicationService.getMyApplications(
                        candidateEmail
                )
        );
    }

    // ADMIN: Get applications for a particular job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsForJob(
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                applicationService.getApplicationsForJob(jobId)
        );
    }
}
package com.example.AIResumeScreeneer.contoller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.AIResumeScreeneer.dto.StatusUpdateRequest;
import com.example.AIResumeScreeneer.entity.Application;
import com.example.AIResumeScreeneer.entity.ApplicationStatus;
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
    @GetMapping("/pipeline")
public ResponseEntity<List<Application>> getPipeline() {

    return ResponseEntity.ok(
            applicationService.getAllApplications()
    );
}

@PutMapping("/{id}/status")
public ResponseEntity<?> updateStatus(
        @PathVariable Long id,
        @RequestBody StatusUpdateRequest request) {

    try {

        ApplicationStatus newStatus =
                ApplicationStatus.valueOf(
                        request.getStatus()
                                .toUpperCase()
                );

        Application updated =
                applicationService.updateStatus(
                        id,
                        newStatus
                );

        return ResponseEntity.ok(updated);

    } catch (IllegalArgumentException e) {

        return ResponseEntity.badRequest()
                .body("Invalid application status");

    } catch (RuntimeException e) {

        return ResponseEntity.badRequest()
                .body(e.getMessage());
    }
}

// ============================================================
// USER: Withdraw application
// ============================================================

@PutMapping("/{id}/withdraw")
public ResponseEntity<?> withdrawApplication(
        @PathVariable Long id,
        Principal principal) {

    try {

        String candidateEmail =
                principal.getName();

        Application updatedApplication =
                applicationService.withdrawApplication(
                        id,
                        candidateEmail
                );

        return ResponseEntity.ok(
                updatedApplication
        );

    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
}
}
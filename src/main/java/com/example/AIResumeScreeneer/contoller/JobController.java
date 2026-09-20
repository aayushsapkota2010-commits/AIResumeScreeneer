package com.example.AIResumeScreeneer.contoller;

import com.example.AIResumeScreeneer.entity.Job;
import com.example.AIResumeScreeneer.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // ==========================================
    // ADMIN - CREATE JOB
    // ==========================================

    @PostMapping
    public ResponseEntity<Job> createJob(
            @RequestBody Job job) {

        return ResponseEntity.ok(
                jobService.createJob(job)
        );
    }

    // ==========================================
    // ADMIN - VIEW ALL JOBS
    // ==========================================

    @GetMapping("/all")
    public ResponseEntity<List<Job>> getAllJobs() {

        return ResponseEntity.ok(
                jobService.getAllJobs()
        );
    }

    // ==========================================
    // USER + ADMIN - VIEW OPEN JOBS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Job>> getOpenJobs() {

        return ResponseEntity.ok(
                jobService.getOpenJobs()
        );
    }

    // ==========================================
    // USER + ADMIN - VIEW JOB DETAILS
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                jobService.getJobById(id)
        );
    }

    // ==========================================
    // ADMIN - UPDATE JOB
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @RequestBody Job job) {

        return ResponseEntity.ok(
                jobService.updateJob(id, job)
        );
    }

    // ==========================================
    // ADMIN - DELETE JOB
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long id) {

        jobService.deleteJob(id);

        return ResponseEntity.ok(
                "Job deleted successfully."
        );
    }
}
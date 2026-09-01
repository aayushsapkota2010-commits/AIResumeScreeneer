package com.example.AIResumeScreeneer.contoller;

import com.example.AIResumeScreeneer.dto.JobRequest;
import com.example.AIResumeScreeneer.dto.JobResponse;
import com.example.AIResumeScreeneer.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;

    @PostMapping("/create")
    public JobResponse createJob(
            @RequestBody JobRequest request) {

        return jobService.create(request);
    }

    @GetMapping("/all")
    public List<JobResponse> getAllJobs() {

        return jobService.getAll();
    }

    @PutMapping("/update/{id}")
public JobResponse updateJob(
        @PathVariable Long id,
        @RequestBody JobRequest request) {

    return jobService.update(id, request);
}
@DeleteMapping("/delete/{id}")
public String deleteJob(@PathVariable Long id) {

    jobService.delete(id);

    return "Job Deleted Successfully";

}

@PutMapping("/close/{id}")
public JobResponse closeJob(@PathVariable Long id) {

    return jobService.closeJob(id);

}

@PutMapping("/reopen/{id}")
public JobResponse reopenJob(@PathVariable Long id) {

    return jobService.reopenJob(id);

}
}
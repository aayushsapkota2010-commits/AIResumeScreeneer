package com.example.AIResumeScreeneer.contoller;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import com.example.AIResumeScreeneer.dto.JobMatchRequest;
import com.example.AIResumeScreeneer.dto.JobMatchResponse;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ResumeRepository;
import com.example.AIResumeScreeneer.service.JobMatchingService;

@RestController
@RequestMapping("/api/job")
@RequiredArgsConstructor
public class JobMatchingController {

    private final ResumeRepository resumeRepository;

    private final JobMatchingService jobMatchingService;

    @PostMapping("/match")
    public JobMatchResponse matchJob(
            @RequestBody JobMatchRequest request) {

        Resume resume =
                resumeRepository.findById(
                        request.getResumeId())
                        .orElseThrow();

        return jobMatchingService.matchResume(
                resume.getExtractedText(),
                request.getJobDescription()
        );
    }
}
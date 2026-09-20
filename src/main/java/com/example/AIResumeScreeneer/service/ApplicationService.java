package com.example.AIResumeScreeneer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.AIResumeScreeneer.entity.Application;
import com.example.AIResumeScreeneer.entity.ApplicationStatus;
import com.example.AIResumeScreeneer.entity.Job;
import com.example.AIResumeScreeneer.entity.Resume;
import com.example.AIResumeScreeneer.repository.ApplicationRepository;
import com.example.AIResumeScreeneer.repository.JobRepository;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;

    @Transactional
    public Application apply(
            Long jobId,
            Long resumeId,
            String candidateEmail) {

        // Find job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        // Job must be open
        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {
            throw new RuntimeException(
                    "This job is no longer accepting applications");
        }

        // Find resume
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        // Make sure resume belongs to logged-in candidate
        if (!candidateEmail.equalsIgnoreCase(
                resume.getCandidateEmail())) {

            throw new RuntimeException(
                    "You are not allowed to use this resume");
        }

        // Prevent duplicate application using same resume
        if (applicationRepository.existsByJobIdAndResumeId(
                jobId, resumeId)) {

            throw new RuntimeException(
                    "You have already applied to this job using this resume");
        }

        Application application = Application.builder()
                .job(job)
                .resume(resume)
                .candidateEmail(candidateEmail)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications(
            String candidateEmail) {

        return applicationRepository
                .findByCandidateEmailOrderByAppliedAtDesc(
                        candidateEmail);
    }

    public List<Application> getApplicationsForJob(
            Long jobId) {

        return applicationRepository
                .findByJobIdOrderByAppliedAtDesc(jobId);
    }
}

package com.example.AIResumeScreeneer.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.AnalyticsResponse;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.repository.InterviewRepository;
import com.example.AIResumeScreeneer.repository.JobRepository;
import com.example.AIResumeScreeneer.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final InterviewRepository interviewRepository;

    public AnalyticsResponse getDashboard() {

        // Count only active resumes.
        long totalCandidates = resumeRepository.countByDeletedFalse();

        // Keep the existing job and interview counts.
        long totalJobs = jobRepository.count();
        long totalInterviews = interviewRepository.count();

        long applied = resumeRepository.countByDeletedFalseAndStatus(
                CandidateStatus.APPLIED);

        long screening = resumeRepository.countByDeletedFalseAndStatus(
                CandidateStatus.SCREENING);

        long shortlisted = resumeRepository.countByDeletedFalseAndStatus(
                CandidateStatus.SHORTLISTED);

        long interviewed = resumeRepository.countByDeletedFalseAndStatus(
                CandidateStatus.INTERVIEW);

        long selected = resumeRepository.countByDeletedFalseAndStatus(
                CandidateStatus.SELECTED);

        long rejected = resumeRepository.countByDeletedFalseAndStatus(
                CandidateStatus.REJECTED);

        Map<String, Long> distribution = new LinkedHashMap<>();
        distribution.put("Applied", applied);
        distribution.put("Screening", screening);
        distribution.put("Shortlisted", shortlisted);
        distribution.put("Interview", interviewed);
        distribution.put("Selected", selected);
        distribution.put("Rejected", rejected);

        return AnalyticsResponse.builder()
                .totalCandidates(totalCandidates)
                .totalJobs(totalJobs)
                .totalInterviews(totalInterviews)
                .selectedCandidates(selected)
                .rejectedCandidates(rejected)
                .shortlistedCandidates(shortlisted)
                .statusDistribution(distribution)
                .build();
    }
}

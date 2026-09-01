package com.example.AIResumeScreeneer.service;

import com.example.AIResumeScreeneer.dto.AnalyticsResponse;
import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.repository.InterviewRepository;
import com.example.AIResumeScreeneer.repository.JobRepository;
import com.example.AIResumeScreeneer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ResumeRepository resumeRepository;

    private final JobRepository jobRepository;

    private final InterviewRepository interviewRepository;

    public AnalyticsResponse getDashboard() {

        long totalCandidates = resumeRepository.count();

        long totalJobs = jobRepository.count();

        long totalInterviews = interviewRepository.count();

        long selectedCandidates =
                resumeRepository.countByStatus(CandidateStatus.SELECTED);

        long rejectedCandidates =
                resumeRepository.countByStatus(CandidateStatus.REJECTED);

        long shortlistedCandidates =
                resumeRepository.countByStatus(CandidateStatus.SHORTLISTED);

        long appliedCandidates =
                totalCandidates
                        - selectedCandidates
                        - rejectedCandidates
                        - shortlistedCandidates;

        Map<String, Long> distribution = new HashMap<>();

        distribution.put("Applied", appliedCandidates);
        distribution.put("Shortlisted", shortlistedCandidates);
        distribution.put("Selected", selectedCandidates);
        distribution.put("Rejected", rejectedCandidates);

        return AnalyticsResponse.builder()

                .totalCandidates(totalCandidates)

                .totalJobs(totalJobs)

                .totalInterviews(totalInterviews)

                .selectedCandidates(selectedCandidates)

                .rejectedCandidates(rejectedCandidates)

                .shortlistedCandidates(shortlistedCandidates)

                .statusDistribution(distribution)

                .build();
    }
}
package com.example.AIResumeScreeneer.service;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.CandidateDashboardResponse;
import com.example.AIResumeScreeneer.entity.Application;
import com.example.AIResumeScreeneer.repository.ApplicationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateDashboardService {

    private final ApplicationRepository applicationRepository;

    public CandidateDashboardResponse getDashboard(String email) {

        Application application =
                applicationRepository
                        .findByCandidateEmailOrderByAppliedAtDesc(email)
                        .stream()
                        .findFirst()
                        .orElse(null);

        // Candidate has not applied to any job yet
        if (application == null) {

            return CandidateDashboardResponse.builder()
                    .resumeId(null)
                    .atsScore(null)
                    .matchScore(null)
                    .status("NOT_APPLIED")
                    .uploadedAt(null)
                    .candidateEmail(email)
                    .build();
        }

        return CandidateDashboardResponse.builder()

                .resumeId(
                        application.getResume().getId()
                )

                .atsScore(
                        application.getAtsScore()
                )

                .matchScore(
                        application.getMatchScore()
                )

                .status(
                        application.getStatus().name()
                )

                .uploadedAt(
                        application.getAppliedAt().toString()
                )

                .candidateEmail(
                        application.getCandidateEmail()
                )

                .build();
    }
}
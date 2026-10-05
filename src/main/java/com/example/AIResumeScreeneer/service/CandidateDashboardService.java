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


        // ============================================================
        // CANDIDATE HAS NOT APPLIED TO ANY JOB
        // ============================================================

        if (application == null) {

            return CandidateDashboardResponse.builder()

                    .resumeId(null)

                    .resumeFileName(null)

                    .atsScore(null)

                    .matchScore(null)

                    .status("NOT_APPLIED")

                    .applicationAppliedAt(null)

                    .candidateEmail(email)

                    .build();
        }


        // ============================================================
        // GET THE EXACT RESUME USED FOR THIS APPLICATION
        // ============================================================

        String resumeFileName = null;

        if (application.getResume() != null) {

            resumeFileName =
                    application.getResume().getFileName();
        }


        // ============================================================
        // RETURN APPLICATION + RESUME INFORMATION TO FRONTEND
        // ============================================================
return CandidateDashboardResponse.builder()
        .resumeId(
                application.getResume() != null
                        ? application.getResume().getId()
                        : null
        )
        .resumeFileName(
                application.getResume() != null
                        ? application.getResume().getFileName()
                        : null
        )
        .atsScore(application.getAtsScore())
        .matchScore(application.getMatchScore())
        .status(
                application.getStatus() != null
                        ? application.getStatus().name()
                        : "UNKNOWN"
        )
        .applicationAppliedAt(
                application.getAppliedAt() != null
                        ? application.getAppliedAt().toString()
                        : null
        )
        .jobTitle(
                application.getJob() != null
                        ? application.getJob().getTitle()
                        : null
        )
        .companyName(
                application.getJob() != null
                        ? application.getJob().getCompany()
                        : null
        )
        .candidateEmail(application.getCandidateEmail())
        .build();
    }
}
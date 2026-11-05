package com.example.AIResumeScreeneer.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.ApplicationSummaryResponse;
import com.example.AIResumeScreeneer.dto.RecruiterDashboardChartResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecruiterDashboardService {

    private final ApplicationService applicationService;

    public RecruiterDashboardChartResponse getChartData() {

        // Use the same source as the recruiter pipeline board so the
        // dashboard charts always match the applications shown there.
        List<ApplicationSummaryResponse> applications = applicationService
                .getPipelineApplications();

        long applied = 0;
        long screening = 0;
        long shortlisted = 0;
        long interview = 0;
        long selected = 0;
        long rejected = 0;
        long withdrawn = 0;

        for (ApplicationSummaryResponse application : applications) {

            String status = application.getStatus();

            if (status == null || status.isBlank()) {
                applied++;
                continue;
            }

            switch (status.toUpperCase()) {
                case "SCREENING":
                    screening++;
                    break;
                case "SHORTLISTED":
                    shortlisted++;
                    break;
                case "INTERVIEW":
                    interview++;
                    break;
                case "SELECTED":
                    selected++;
                    break;
                case "REJECTED":
                    rejected++;
                    break;
                case "WITHDRAWN":
                    withdrawn++;
                    break;
                case "APPLIED":
                default:
                    applied++;
                    break;
            }
        }

        return RecruiterDashboardChartResponse.builder()
                .applied(applied)
                .screening(screening)
                .shortlisted(shortlisted)
                .interview(interview)
                .selected(selected)
                .rejected(rejected)
                .withdrawn(withdrawn)
                .build();
    }
}

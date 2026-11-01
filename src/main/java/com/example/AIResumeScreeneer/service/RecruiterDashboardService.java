package com.example.AIResumeScreeneer.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.AIResumeScreeneer.dto.RecruiterDashboardChartResponse;
import com.example.AIResumeScreeneer.entity.Application;
import com.example.AIResumeScreeneer.entity.ApplicationStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecruiterDashboardService {

    private final ApplicationService applicationService;

    public RecruiterDashboardChartResponse getChartData() {

        // Use the same source as the recruiter pipeline board so the
        // dashboard charts always match the applications shown there.
        List<Application> applications = applicationService
                .getAllApplications();

        long applied = 0;
        long screening = 0;
        long shortlisted = 0;
        long interview = 0;
        long selected = 0;
        long rejected = 0;
        long withdrawn = 0;

        for (Application application : applications) {

            ApplicationStatus status = application.getStatus();

            if (status == null) {
                applied++;
                continue;
            }

            switch (status) {
                case SCREENING:
                    screening++;
                    break;
                case SHORTLISTED:
                    shortlisted++;
                    break;
                case INTERVIEW:
                    interview++;
                    break;
                case SELECTED:
                    selected++;
                    break;
                case REJECTED:
                    rejected++;
                    break;
                case WITHDRAWN:
                    withdrawn++;
                    break;
                case APPLIED:
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

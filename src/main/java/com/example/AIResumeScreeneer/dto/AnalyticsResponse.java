package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {

    private long totalCandidates;

    private long totalJobs;

    private long totalInterviews;

    private long selectedCandidates;

    private long rejectedCandidates;

    private long shortlistedCandidates;

    private Map<String, Long> statusDistribution;

}
package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateDashboardResponse {

    private Long resumeId;

    private Integer atsScore;

    private Integer matchScore;

    private String status;

    private String uploadedAt;

    private String candidateEmail;
}
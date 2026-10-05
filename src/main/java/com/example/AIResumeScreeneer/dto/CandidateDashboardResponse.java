package com.example.AIResumeScreeneer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateDashboardResponse {

    // ==============================
    // RESUME USED BY LATEST APPLICATION
    // ==============================

    private Long resumeId;

    private String resumeFileName;

    private Integer atsScore;

    // ==============================
    // LATEST APPLICATION
    // ==============================

    private Integer matchScore;

    private String status;
    private String jobTitle;
private String companyName;

    private String applicationAppliedAt;

    // ==============================
    // CANDIDATE
    // ==============================

    private String candidateEmail;
}
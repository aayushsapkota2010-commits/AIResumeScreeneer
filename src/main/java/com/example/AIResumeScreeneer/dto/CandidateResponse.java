package com.example.AIResumeScreeneer.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CandidateResponse {

    private Long resumeId;

    private Integer atsScore;

    private Integer matchScore;

    private String skills;
}
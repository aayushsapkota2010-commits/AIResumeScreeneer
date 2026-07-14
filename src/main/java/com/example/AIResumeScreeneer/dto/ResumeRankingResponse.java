package com.example.AIResumeScreeneer.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResumeRankingResponse {

    private int rank;

    private Long resumeId;

    private Integer atsScore;

    private Integer matchScore;
}
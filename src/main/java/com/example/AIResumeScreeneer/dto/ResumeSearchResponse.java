package com.example.AIResumeScreeneer.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResumeSearchResponse {

    private Long id;

    private String fileName;

    private Integer atsScore;

    private Integer matchScore;

    private String skills;

    private String status;
}
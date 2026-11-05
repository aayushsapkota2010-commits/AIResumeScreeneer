package com.example.AIResumeScreeneer.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationSummaryResponse {

    private Long id;

    private String candidateEmail;

    private String status;

    private LocalDateTime appliedAt;

    private LocalDateTime updatedAt;

    private Integer atsScore;

    private Integer matchScore;

    private JobSummary job;

    private ResumeSummary resume;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobSummary {

        private Long id;

        private String title;

        private String company;

        private String location;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeSummary {

        private Long id;

        private String fileName;
    }
}

package com.example.AIResumeScreeneer.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "applications",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"job_id", "resume_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ============================================================
    // JOB
    // ============================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "job_id",
        nullable = false
    )
    private Job job;


    // ============================================================
    // RESUME
    // ============================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "resume_id",
        nullable = false
    )
    private Resume resume;


    // ============================================================
    // CANDIDATE
    // ============================================================

    @Column(nullable = false)
    private String candidateEmail;


    // ============================================================
    // APPLICATION STATUS
    // ============================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;


    // ============================================================
    // DATES
    // ============================================================

    @Column(nullable = false)
    private LocalDateTime appliedAt;

    private LocalDateTime updatedAt;


    // ============================================================
    // JOB-SPECIFIC ATS ANALYSIS
    // ============================================================

    /*
     * ATS score for THIS particular job.
     *
     * Example:
     *
     * Same resume:
     * ML Job      -> 89
     * Backend Job -> 42
     */

    private Integer atsScore;


    /*
     * Overall job match percentage.
     *
     * This is different from ATS score.
     */

    private Integer matchScore;


    /*
     * Skills found in both:
     *
     * Resume + Job Description
     */

    @Column(length = 3000)
    private String matchedSkills;


    /*
     * Skills required by the job
     * but not found in the resume.
     */

    @Column(length = 3000)
    private String missingSkills;


    /*
     * Explanation/recommendation generated
     * by the matching engine.
     */

    @Column(length = 5000)
    private String recommendation;
}
package com.example.AIResumeScreeneer.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String filePath;

    private String contentType;

    private Long fileSize;

    private LocalDateTime uploadedAt;

    @Column(columnDefinition = "LONGTEXT")
private String extractedText;

private Integer atsScore;

@Column(columnDefinition = "TEXT")
private String skills;

@Column(columnDefinition = "TEXT")
private String suggestions;

@Column(columnDefinition = "LONGTEXT")
private String jobDescription;
private String candidateEmail;
private Integer matchScore;
private Boolean shortlisted;
@Enumerated(EnumType.STRING)
private CandidateStatus status;


@Column(nullable = false)
@Builder.Default
private boolean deleted = false;
}
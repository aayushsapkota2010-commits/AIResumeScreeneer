package com.example.AIResumeScreeneer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(nullable = false)
    private LocalDate interviewDate;

    @Column(nullable = false)
    private LocalTime interviewTime;

    @Column(nullable = false)
    private String interviewer;

    @Column(nullable = false)
    private String mode;          // Online / Offline

    private String location;

    private String meetingLink;

    @Column(nullable = false)
@Enumerated(EnumType.STRING)
private InterviewStatus status;
    @Column(length = 2000)
    private String notes;
}
package com.example.AIResumeScreeneer.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recruiter_notes")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecruiterNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long resumeId;

    @Column(length = 5000)
    private String note;

    private LocalDateTime createdAt;
}
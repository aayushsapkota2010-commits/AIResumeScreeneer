package com.example.AIResumeScreeneer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.AIResumeScreeneer.entity.Application;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application>
    findByCandidateEmailOrderByAppliedAtDesc(
            String candidateEmail
    );

    List<Application>
    findByJobIdOrderByAppliedAtDesc(
            Long jobId
    );

    boolean existsByJobIdAndResumeId(
            Long jobId,
            Long resumeId
    );

    // NEW
    List<Application>
    findAllByOrderByAppliedAtDesc();
}
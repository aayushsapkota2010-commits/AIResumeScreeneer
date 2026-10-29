
package com.example.AIResumeScreeneer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.AIResumeScreeneer.entity.Application;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByCandidateEmailOrderByAppliedAtDesc(
            String candidateEmail
    );

    List<Application> findByJobIdOrderByAppliedAtDesc(
            Long jobId
    );

    boolean existsByJobIdAndResumeId(
            Long jobId,
            Long resumeId
    );

    boolean existsByResumeId(Long resumeId);

    // Fetch all applications, including historical ones.
    List<Application> findAllByOrderByAppliedAtDesc();

    Application findFirstByResumeIdOrderByAppliedAtDesc(
            Long resumeId
    );

    // Fetch applications linked only to active resumes.
    List<Application> findByResumeDeletedFalseOrderByAppliedAtDesc();

    
List<Application>
findByCandidateEmailAndResumeDeletedFalseOrderByAppliedAtDesc(
        String candidateEmail);

List<Application>
findByJobIdAndResumeDeletedFalseOrderByAppliedAtDesc(
        Long jobId);

        
List<Application> findByResumeIdOrderByAppliedAtDesc(Long resumeId);


}

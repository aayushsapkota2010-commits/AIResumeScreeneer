package com.example.AIResumeScreeneer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.AIResumeScreeneer.entity.CandidateStatus;
import com.example.AIResumeScreeneer.entity.Resume;
import java.util.Optional;

public interface ResumeRepository
        extends JpaRepository<Resume, Long> {

    List<Resume> findBySkillsContainingIgnoreCase(
            String skill);
            long countByStatus(
        CandidateStatus status);
        
List<Resume> findBySkillsContainingIgnoreCaseAndStatusAndAtsScoreGreaterThanEqual(
        String skill,
        CandidateStatus status,
        Integer atsScore);

        Optional<Resume>
findTopByCandidateEmailOrderByIdDesc(
        String candidateEmail);
        List<Resume> findByStatus(
        CandidateStatus status);

        List<Resume> findByCandidateEmailOrderByUploadedAtDesc(String candidateEmail);
        
}
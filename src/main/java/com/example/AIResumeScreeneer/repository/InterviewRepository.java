package com.example.AIResumeScreeneer.repository;

import com.example.AIResumeScreeneer.entity.Interview;
import com.example.AIResumeScreeneer.entity.InterviewStatus;
import com.example.AIResumeScreeneer.entity.Resume;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    Optional<Interview> findByResume(Resume resume);

    List<Interview> findByStatus(InterviewStatus status);

    List<Interview> findByInterviewer(String interviewer);

    List<Interview> findByInterviewDate(LocalDate interviewDate);

    void deleteByResume(Resume resume);

    List<Interview>
findByResumeCandidateEmailOrderByInterviewDateAscInterviewTimeAsc(
        String candidateEmail
);
}
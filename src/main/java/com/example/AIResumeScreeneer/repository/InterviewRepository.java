package com.example.AIResumeScreeneer.repository;

import com.example.AIResumeScreeneer.entity.Interview;
import com.example.AIResumeScreeneer.entity.InterviewStatus;
import com.example.AIResumeScreeneer.entity.Resume;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    Optional<Interview> findByResume(Resume resume);

    List<Interview> findByResumeIdOrderByIdAsc(Long resumeId);

    @Query("select new map("
            + "i.id as id, "
            + "i.resume.id as resumeId, "
            + "i.status as status"
            + ") from Interview i")
    List<Map<String, Object>> findInterviewStatusSummaries();

    List<Interview> findByStatus(InterviewStatus status);

    List<Interview> findByInterviewer(String interviewer);

    List<Interview> findByInterviewDate(LocalDate interviewDate);

    void deleteByResume(Resume resume);

    List<Interview>
findByResumeCandidateEmailOrderByInterviewDateAscInterviewTimeAsc(
        String candidateEmail
);

boolean existsByResumeId(Long resumeId);

long countByResumeDeletedFalse();
}